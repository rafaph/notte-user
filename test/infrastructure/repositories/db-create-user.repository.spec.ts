import { DbCreateUserRepository } from "@/infrastructure/repositories";

import { UserBuilder } from "@test/builders";
import { TestDb } from "@test/helpers";
import { queryUser } from "@test/infrastructure/repositories/helpers";

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
