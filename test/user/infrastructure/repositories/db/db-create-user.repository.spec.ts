import { DbCreateUserRepository } from "@/user/infrastructure/repositories/db";

import { TestDb } from "@test/helpers";
import { UserBuilder } from "@test/user/builders";
import { queryUser } from "@test/user/infrastructure/repositories/db/helpers";

describe(DbCreateUserRepository.name, () => {
  it("should create user", async () => {
    await new TestDb().run(async (knex) => {
      // given
      const sut = new DbCreateUserRepository(knex);
      const user = new UserBuilder().build();

      // when
      await sut.create(user);

      // then
      const [dbUser] = await queryUser(knex, { id: user.id });
      expect(user).toEqual(dbUser);
    });
  });
});
