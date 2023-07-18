import { PgCreateUserRepository } from "@/user/infrastructure/repositories/pg";

import { TestDb } from "@test/helpers";
import { UserBuilder } from "@test/user/builders";
import { queryUser } from "@test/user/infrastructure/repositories/pg/helpers";

describe(PgCreateUserRepository.name, () => {
  it("should create user", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const sut = new PgCreateUserRepository(pool);
      const user = new UserBuilder().build();

      // when
      await sut.create(user);

      // then
      const [dbUser] = await queryUser(pool, { id: user.id });
      expect(user).toEqual(dbUser);
    });
  });
});
