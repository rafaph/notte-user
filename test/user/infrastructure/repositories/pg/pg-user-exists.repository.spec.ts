import { faker } from "@faker-js/faker";

import { PgUserExistsRepository } from "@/user/infrastructure/repositories/pg";

import { TestDb } from "@test/helpers";
import { UserBuilder } from "@test/user/builders";
import { insertUser } from "@test/user/infrastructure/repositories/pg/helpers";

describe(PgUserExistsRepository.name, () => {
  it("should return true if user exists", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const sut = new PgUserExistsRepository(pool);
      const user = new UserBuilder().build();
      await insertUser(pool, user);

      // when
      const exists = await sut.exists(user.email);

      // then
      expect(exists).toBeTruthy();
    });
  });

  it("should return false if no user is found", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const sut = new PgUserExistsRepository(pool);
      const email = faker.internet.email();

      // when
      const exists = await sut.exists(email);

      // then
      expect(exists).toBeFalsy();
    });
  });
});
