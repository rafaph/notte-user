import { Server } from "http";

import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { DeleteUserRepository } from "@/domain/repositories";

import { UserBuilder } from "@test/builders";
import { TestApp, TestUtils } from "@test/helpers";
import {
  insertUser,
  queryUser,
} from "@test/infrastructure/repositories/helpers";

function makeRequest(
  app: INestApplication<Server>,
  userId: string,
): Promise<request.Response> {
  const server = app.getHttpServer();

  return request(server)
    .delete(`/api/v1/user/${userId}`)
    .set("Content-Type", "application/json")
    .send();
}

describe("DELETE /api/v1/user", () => {
  it("should response NO_CONTENT", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const { knex } = app.get(TestUtils);
      await insertUser(knex, user);

      // when
      const response = await makeRequest(app, user.id);

      // then
      expect(response.status).toEqual(HttpStatus.NO_CONTENT);
      const result = await queryUser(knex, { id: user.id });
      expect(result).toHaveLength(0);
    });
  });

  it("should response BAD_REQUEST", async () => {
    await new TestApp().run(async (app) => {
      // given
      const userId = faker.string.alphanumeric();

      // when
      const response = await makeRequest(app, userId);

      // then
      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  it("should response INTERNAL_SERVER_ERROR", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const deleteUserRepository = app.get(DeleteUserRepository);
      jest
        .spyOn(deleteUserRepository, "delete")
        .mockRejectedValueOnce(new Error());

      // when
      const response = await makeRequest(app, user.id);

      // then
      expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
