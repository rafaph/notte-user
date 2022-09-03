import { faker } from "@faker-js/faker";
import axios from "axios";
import httpStatus from "http-status";
import parallel from "mocha.parallel";

import { makeUser } from "@test/domain/factories/make-user";
import { TestApp } from "@test/helpers/test-app";
import { makeCreateUserRequestBody } from "@test/infra/helpers/make-create-user-request-body";
import { insertUser } from "@test/infra/repositories/pg/helpers/insert-user";
import { selectUser } from "@test/infra/repositories/pg/helpers/select-user";

const endpoint = "/users";
const makeUrl = (address: string) => `${address}${endpoint}`;
const makeRequest = <T = { id: string }>(address: string, body: unknown) =>
  axios.post<T>(makeUrl(address), body, { validateStatus: null });

parallel(`POST ${endpoint} @integration`, () => {
  it("should return an user id when created successfully", async () => {
    await new TestApp().run(async (address, pool) => {
      // given
      const body = makeCreateUserRequestBody();
      // when
      const { status, data } = await makeRequest(address, body);
      // then
      expect(status).to.be.equal(httpStatus.CREATED);
      const createdUser = await selectUser(pool, data.id);
      expect(createdUser.email).to.be.equal(body.email);
    });
  });

  it(`should return status ${httpStatus.BAD_REQUEST} when body is invalid`, async () => {
    await new TestApp().run(async (address) => {
      // given
      const body = makeCreateUserRequestBody({
        email: faker.name.firstName(),
      });
      // when
      const { status } = await makeRequest(address, body);
      // then
      expect(status).to.be.equal(httpStatus.BAD_REQUEST);
    });
  });

  it(`should return status ${httpStatus.UNPROCESSABLE_ENTITY} when user already exists`, async () => {
    await new TestApp().run(async (address, pool) => {
      // given
      const user = makeUser();
      await insertUser(pool, user);
      // when
      const body = makeCreateUserRequestBody({
        email: user.email,
      });
      // when
      const { status } = await makeRequest(address, body);
      // then
      expect(status).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });
});
