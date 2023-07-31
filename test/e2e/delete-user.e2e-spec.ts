import { Server } from "http";

import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { TokenService } from "@/application/services";
import { DeleteUserRepository } from "@/domain/repositories";

import { UserBuilder } from "@test/builders";
import { TestApp, TestUtils } from "@test/helpers";
import {
  insertUser,
  queryUser,
} from "@test/infrastructure/repositories/helpers";

function makeRequest(
  app: INestApplication<Server>,
  token: string,
): Promise<request.Response> {
  const server = app.getHttpServer();

  return request(server)
    .delete("/api/v1/user")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send();
}

describe("DELETE /api/v1/user", () => {
  it("should response OK", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const { knex } = app.get(TestUtils);
      const tokenService = app.get(TokenService);
      await insertUser(knex, user);
      const token = await tokenService.sign(user.id);

      // when
      const response = await makeRequest(app, token);

      // then
      expect(response.status).toEqual(HttpStatus.OK);
      const result = await queryUser(knex, { id: user.id });
      expect(result).toHaveLength(0);
    });
  });

  it("should response INTERNAL_SERVER_ERROR", async () => {
    await new TestApp().run(async (app) => {
      // given
      const user = new UserBuilder().build();
      const deleteUserRepository = app.get(DeleteUserRepository);
      const tokenService = app.get(TokenService);

      const token = await tokenService.sign(user.id);
      jest
        .spyOn(deleteUserRepository, "delete")
        .mockRejectedValueOnce(new Error());

      // when
      const response = await makeRequest(app, token);

      // then
      expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
