import { faker } from "@faker-js/faker";

import { PgGetUserByEmailRepository } from "@/infra/repositories/pg/pg-get-user-by-email-repository";

import { makeUser } from "@test/domain/factories/make-user";
import { TestDb } from "@test/helpers/test-db";
import { insertUser } from "@test/infra/repositories/pg/helpers/insert-user";

describe(`${PgGetUserByEmailRepository.name} @integration`, () => {
  it("should return a user from db", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const user = makeUser();
      await insertUser(pool, user);
      const repository = new PgGetUserByEmailRepository(pool);
      // when
      const optionUser = await repository.getByEmail(user.email);
      // then
      expect(optionUser.isSome()).to.be.true;
      expect(optionUser.unwrap()).to.be.deep.equal(user);
    });
  });

  it("should throw an error if a invalid user is retrieved from database", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const user = makeUser();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user["email"] = faker.name.firstName();
      await insertUser(pool, user);
      const repository = new PgGetUserByEmailRepository(pool);
      // when
      const optionUser = repository.getByEmail(user.email);
      // then
      await expect(optionUser).to.eventually.be.rejected;
    });
  });

  it("should not return a user from db", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const repository = new PgGetUserByEmailRepository(pool);
      // when
      const optionUser = await repository.getByEmail(faker.internet.email());
      // then
      expect(optionUser.isNone()).to.be.true;
    });
  });
});
