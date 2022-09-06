import { faker } from "@faker-js/faker";
import axios from "axios";
import httpStatus from "http-status";
import parallel from "mocha.parallel";

import { Argon2PasswordService } from "@/infra/services/argon2-password-service";

import { makeUser } from "@test/domain/factories/make-user";
import { TestApp } from "@test/helpers/test-app";
import { makeGetUserRequestBody } from "@test/infra/factories/make-get-user-request-body";
import { insertUser } from "@test/infra/repositories/pg/helpers/insert-user";

const endpoint = "/users/verify";
const makeUrl = (address: string) => `${address}${endpoint}`;
const makeRequest = <T = { id: string }>(address: string, body: unknown) =>
  axios.post<T>(makeUrl(address), body, { validateStatus: null });

parallel(`POST ${endpoint} @integration`, () => {
  it("should return an user id when verify successfully", async () => {
    await new TestApp().run(async (address, pool) => {
      // given
      const hashService = new Argon2PasswordService();
      const password = faker.internet.password();
      const user = makeUser({
        password: await hashService.hash(password),
      });
      await insertUser(pool, user);
      const body = makeGetUserRequestBody({
        email: user.email,
        password,
      });
      // when
      const { status, data } = await makeRequest(address, body);
      // then
      expect(status).to.be.equal(httpStatus.OK);
      expect(user).to.containSubset(data);
    });
  });

  it(`should return status ${httpStatus.NOT_FOUND} when user is not found`, async () => {
    await new TestApp().run(async (address) => {
      // given
      const body = makeGetUserRequestBody();
      // when
      const { status } = await makeRequest(address, body);
      // then
      expect(status).to.be.equal(httpStatus.NOT_FOUND);
    });
  });

  it(`should return status ${httpStatus.NOT_FOUND} when user password is incorrect`, async () => {
    await new TestApp().run(async (address, pool) => {
      // given
      const user = makeUser();
      await insertUser(pool, user);
      const body = makeGetUserRequestBody({
        email: user.email,
      });
      // when
      const { status } = await makeRequest(address, body);
      // then
      expect(status).to.be.equal(httpStatus.NOT_FOUND);
    });
  });

  it(`should return status ${httpStatus.BAD_REQUEST} if email field is not an email`, async () => {
    await new TestApp().run(async (address) => {
      // given
      const body = makeGetUserRequestBody({
        email: faker.name.firstName(),
      });
      // when
      const { status } = await makeRequest(address, body);
      // then
      expect(status).to.be.equal(httpStatus.BAD_REQUEST);
    });
  });
});
