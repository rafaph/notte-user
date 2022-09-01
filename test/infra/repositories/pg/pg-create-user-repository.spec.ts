import { PgCreateUserRepository } from "@/infra/repositories/pg/pg-create-user-repository";

import { makeUser } from "@test/domain/factories/make-user";
import { TestDb } from "@test/helpers/test-db";
import { insertUser } from "@test/infra/repositories/pg/helpers/insert-user";
import { selectUser } from "@test/infra/repositories/pg/helpers/select-user";

describe(`${PgCreateUserRepository.name} @integration`, () => {
  it("should create an user", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const repository = new PgCreateUserRepository(pool);
      const user = makeUser();
      // when
      await repository.create(user);
      // then
      await expect(selectUser(pool, user.id)).to.eventually.be.deep.equal(user);
    });
  });

  it("should throw an error if user already exists", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const repository = new PgCreateUserRepository(pool);
      // given
      const user = makeUser();
      await insertUser(pool, user);
      // when
      const promise = repository.create(user);
      // then
      await expect(promise).to.be.rejected;
    });
  });
});
