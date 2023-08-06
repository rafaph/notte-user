import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { CreateUserRepository } from "@/domain/repositories";
import { Response } from "@/infrastructure/tcp/interfaces";

import { CreateUserRequestBuilder, UserBuilder } from "@test/builders";
import { TestApp, TestUtils } from "@test/helpers";
import { insertUser } from "@test/infrastructure/repositories/helpers";

async function makeRequest(
  client: ClientProxy,
  request: Record<string, unknown>,
): Promise<Response> {
  const observable = client.send<Response>("user.create", request);

  return await firstValueFrom<Response>(observable).catch(
    (error: Response) => error,
  );
}

describe("POST /api/v1/user", () => {
  it("should response CREATED", async () => {
    await new TestApp().run(async (client) => {
      // given
      const request = new CreateUserRequestBuilder().build();

      // when
      const response = await makeRequest(client, request);

      // then
      expect(response.status).toEqual(HttpStatus["201"]);
    });
  });

  it("should response BAD_REQUEST", async () => {
    await new TestApp().run(async (client) => {
      //given/when
      const response = await makeRequest(client, {});

      // then
      expect(response.status).toBe(HttpStatus["400"]);
    });
  });

  it("should response BAD_REQUEST when passwordConfirmation is different from the password", async () => {
    await new TestApp().run(async (client) => {
      // given
      const request = new CreateUserRequestBuilder()
        .withPasswordConfirmation(faker.internet.password())
        .build();

      // when
      const response = await makeRequest(client, request);

      // then
      expect(response.status).toBe(HttpStatus["400"]);
    });
  });

  it("should response CONFLICT when email is already in use by another user", async () => {
    await new TestApp().run(async (client, app) => {
      // given
      const user = new UserBuilder().build();
      const request = new CreateUserRequestBuilder()
        .withEmail(user.email)
        .build();
      const { knex } = app.get(TestUtils);
      await insertUser(knex, user);

      // when
      const response = await makeRequest(client, request);

      // then
      expect(response.status).toBe(HttpStatus["409"]);
    });
  });

  it("should response INTERNAL_SERVER_ERROR", async () => {
    await new TestApp().run(async (client, app) => {
      // given
      const request = new CreateUserRequestBuilder().build();
      const createUserRepository = app.get(CreateUserRepository);
      jest
        .spyOn(createUserRepository, "create")
        .mockRejectedValueOnce(undefined);

      // when
      const response = await makeRequest(client, request);

      // then
      expect(response.status).toBe(HttpStatus["500"]);
    });
  });
});
