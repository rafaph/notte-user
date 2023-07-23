import { Server } from "http";

import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Knex } from "knex";
import { DEFAULT_CONNECTION_NAME } from "nest-knexjs/dist/knex.constants";
import * as request from "supertest";

import { PasswordService } from "@/application/services";

import { LoginRequestBuilder, UserBuilder } from "@test/builders";
import { TestApp } from "@test/helpers";
import { insertUser } from "@test/infrastructure/repositories/helpers";

function makeRequest(
  app: INestApplication<Server>,
  body: { [key: string]: unknown },
): Promise<request.Response> {
  const server = app.getHttpServer();

  return request(server)
    .post("/api/v1/user/login")
    .set("Content-Type", "application/json")
    .send(body);
}

describe("POST /api/v1/user/login", () => {
  it("should response OK", async () => {
    await new TestApp().run(async (app) => {
      // given
      const knex: Knex = app.get(DEFAULT_CONNECTION_NAME);
      const passwordService = app.get(PasswordService);
      const password = faker.internet.password();
      const hashedPassword = await passwordService.hash(password);
      const user = new UserBuilder().withPassword(hashedPassword).build();
      await insertUser(knex, user);
      const request = new LoginRequestBuilder()
        .withEmail(user.email)
        .withPassword(password)
        .build();

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty("token");
    });
  });

  it("should response BAD_REQUEST", async () => {
    await new TestApp().run(async (app) => {
      //given/when
      const response = await makeRequest(app, {});

      // then
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  it("should response UNAUTHORIZED when user is not found", async () => {
    await new TestApp().run(async (app) => {
      // given
      const request = new LoginRequestBuilder().build();

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it("should response UNAUTHORIZED when password is not correct", async () => {
    await new TestApp().run(async (app) => {
      // given
      const knex: Knex = app.get(DEFAULT_CONNECTION_NAME);
      const passwordService = app.get(PasswordService);
      const hashedPassword = await passwordService.hash(
        faker.internet.password(),
      );
      const user = new UserBuilder().withPassword(hashedPassword).build();
      await insertUser(knex, user);
      const request = new LoginRequestBuilder().withEmail(user.email).build();

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it("should response INTERNAL_SERVER_ERROR", async () => {
    await new TestApp().run(async (app) => {
      // given
      const request = new LoginRequestBuilder().build();
      jest
        .spyOn(app.get(QueryBus), "execute")
        .mockRejectedValueOnce(new Error());

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
