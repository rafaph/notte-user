import { DbDeleteUserRepository } from "@/infrastructure/repositories";

import { UserBuilder } from "@test/builders";
import { TestDb } from "@test/helpers";
import {
  insertUser,
  queryUser,
} from "@test/infrastructure/repositories/helpers";

describe(DbDeleteUserRepository.name, () => {
  it("should delete user", async () => {
    await new TestDb().run(async (knex) => {
      // given
      const sut = new DbDeleteUserRepository(knex);
      const user = new UserBuilder().build();
      await insertUser(knex, user);

      // when
      await sut.delete(user.id);

      // then
      const result = await queryUser(knex, { id: user.id });
      expect(result).toHaveLength(0);
    });
  });

  it("should not throw if no user is found", async () => {
    await new TestDb().run(async (knex) => {
      // given
      const sut = new DbDeleteUserRepository(knex);
      const user = new UserBuilder().build();

      // when
      const resultPromise = sut.delete(user.id);

      // then
      await expect(resultPromise).resolves.toBeUndefined();
    });
  });
});
