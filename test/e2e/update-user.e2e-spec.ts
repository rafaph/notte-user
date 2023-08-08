import { Server } from "http";

import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { omit } from "lodash";
import * as request from "supertest";

import { PasswordService } from "@/application/services";

import { UpdateUserRequestBuilder, UserBuilder } from "@test/builders";
import { TestApp, TestUtils } from "@test/helpers";
import {
  insertUser,
  queryUser,
} from "@test/infrastructure/repositories/helpers";

function makeRequest(
  app: INestApplication<Server>,
  userId: string,
  body: { [key: string]: unknown },
): Promise<request.Response> {
  const server = app.getHttpServer();

  return request(server)
    .patch(`/api/v1/user/${userId}`)
    .set("Content-Type", "application/json")
    .send(body);
}

describe("PATCH /api/v1/user", () => {
  it("should response OK", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const { knex } = app.get(TestUtils);
      const passwordService = app.get(PasswordService);
      await insertUser(knex, user);
      const request = new UpdateUserRequestBuilder().build();

      // when
      const response = await makeRequest(app, user.id, request);

      // then
      expect(response.status).toEqual(HttpStatus.OK);
      const [dbUser] = await queryUser(knex, { id: user.id });
      expect(dbUser).toEqual(
        expect.objectContaining(
          omit(request, ["password", "passwordConfirmation"]),
        ),
      );
      await expect(
        passwordService.verify(dbUser.password, request.password as string),
      ).resolves.toBeTruthy();
    });
  });

  it("should response OK when updating partially a user", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const { knex } = app.get(TestUtils);
      await insertUser(knex, user);
      const request = new UpdateUserRequestBuilder()
        .withPassword()
        .withPasswordConfirmation()
        .withLastName()
        .build();

      // when
      const response = await makeRequest(app, user.id, request);

      // then
      expect(response.status).toEqual(HttpStatus.OK);
      const [dbUser] = await queryUser(knex, { id: user.id });
      expect(dbUser).toEqual(expect.objectContaining(request));
    });
  });

  it("should response BAD_REQUEST when passwordConfirmation is different from the password", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const request = new UpdateUserRequestBuilder()
        .withPasswordConfirmation(faker.internet.password())
        .build();

      // when
      const response = await makeRequest(app, user.id, request);

      // then
      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  it("should response BAD_REQUEST when request body is empty", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const request = {};

      // when
      const response = await makeRequest(app, user.id, request);

      // then
      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  it("should response NOT_FOUND user is not found", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const request = new UpdateUserRequestBuilder().build();

      // when
      const response = await makeRequest(app, user.id, request);

      // then
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  it("should response CONFLICT email is already in use by another user", async () => {
    await new TestApp().run(async (app) => {
      // given
      const email = faker.internet.email();
      const user = new UserBuilder().build();
      const { knex } = app.get(TestUtils);
      await insertUser(knex, user);
      await insertUser(knex, new UserBuilder().withEmail(email).build());
      const request = new UpdateUserRequestBuilder().withEmail(email).build();

      // when
      const response = await makeRequest(app, user.id, request);

      // then
      expect(response.status).toEqual(HttpStatus.CONFLICT);
    });
  });

  it("should response INTERNAL_SERVER_ERROR", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const { knex } = app.get(TestUtils);
      jest.spyOn(knex, "select").mockImplementationOnce(() => {
        throw new Error();
      });
      const request = new UpdateUserRequestBuilder().build();

      // when
      const response = await makeRequest(app, user.id, request);

      // then
      expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
