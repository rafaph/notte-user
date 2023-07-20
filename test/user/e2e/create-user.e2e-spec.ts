import { Server } from "http";

import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Knex } from "knex";
import { DEFAULT_CONNECTION_NAME } from "nest-knexjs/dist/knex.constants";
import * as request from "supertest";

import { CreateUserRepository } from "@/user/domain/repositories";

import { TestApp } from "@test/helpers";
import { UserBuilder, CreateUserRequestBuilder } from "@test/user/builders";
import { insertUser } from "@test/user/infrastructure/repositories/db/helpers";

function makeRequest(
  app: INestApplication<Server>,
  body: { [key: string]: unknown },
): Promise<request.Response> {
  const server = app.getHttpServer();

  return request(server)
    .post("/api/v1/user")
    .set("Content-Type", "application/json")
    .send(body);
}

describe("POST /api/v1/user", () => {
  it("should response CREATED", async () => {
    await new TestApp().run(async (app) => {
      // given
      const request = new CreateUserRequestBuilder().build();

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.CREATED);
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

  it("should response BAD_REQUEST when passwordConfirmation is different from the password", async () => {
    await new TestApp().run(async (app) => {
      // given
      const request = new CreateUserRequestBuilder()
        .withPasswordConfirmation(faker.internet.password())
        .build();

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  it("should response CONFLICT when email is already in use by another user", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const request = new CreateUserRequestBuilder()
        .withEmail(user.email)
        .build();
      const knex: Knex = app.get(DEFAULT_CONNECTION_NAME);
      await insertUser(knex, user);

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.CONFLICT);
    });
  });

  it("should response INTERNAL_SERVER_ERROR", async () => {
    await new TestApp().run(async (app) => {
      // given
      const request = new CreateUserRequestBuilder().build();
      const createUserRepository = app.get(CreateUserRepository);
      jest
        .spyOn(createUserRepository, "create")
        .mockRejectedValueOnce(undefined);

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
