import { Server } from "http";

import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import * as request from "supertest";

import { PasswordService } from "@/application/services";

import { UserBuilder, VerifyUserRequestBuilder } from "@test/builders";
import { TestApp, TestUtils } from "@test/helpers";
import { insertUser } from "@test/infrastructure/repositories/helpers";

function makeRequest(
  app: INestApplication<Server>,
  body: { [key: string]: unknown },
): Promise<request.Response> {
  const server = app.getHttpServer();

  return request(server)
    .post("/api/v1/user/verify")
    .set("Content-Type", "application/json")
    .send(body);
}

describe("POST /api/v1/user/verify", () => {
  it("should response OK when user is verified", async () => {
    await new TestApp().run(async (app) => {
      // given
      const { knex } = app.get(TestUtils);
      const passwordService = app.get(PasswordService);
      const password = faker.internet.password();
      const hashedPassword = await passwordService.hash(password);
      const user = new UserBuilder().withPassword(hashedPassword).build();
      await insertUser(knex, user);
      const request = new VerifyUserRequestBuilder()
        .withEmail(user.email)
        .withPassword(password)
        .build();

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.body).toEqual({ userId: user.id });
      expect(response.status).toBe(HttpStatus.OK);
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
      const request = new VerifyUserRequestBuilder().build();

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it("should response UNAUTHORIZED when password is not correct", async () => {
    await new TestApp().run(async (app) => {
      // given
      const { knex } = app.get(TestUtils);
      const passwordService = app.get(PasswordService);
      const hashedPassword = await passwordService.hash(
        faker.internet.password(),
      );
      const user = new UserBuilder().withPassword(hashedPassword).build();
      await insertUser(knex, user);
      const request = new VerifyUserRequestBuilder()
        .withEmail(user.email)
        .build();

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it("should response INTERNAL_SERVER_ERROR", async () => {
    await new TestApp().run(async (app) => {
      // given
      const request = new VerifyUserRequestBuilder().build();
      jest
        .spyOn(app.get(CommandBus), "execute")
        .mockRejectedValueOnce(new Error());

      // when
      const response = await makeRequest(app, request);

      // then
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
