import { faker } from "@faker-js/faker";

import { DbUserExistsRepository } from "@/infrastructure/repositories";

import { UserBuilder } from "@test/builders";
import { TestDb } from "@test/helpers";
import { insertUser } from "@test/infrastructure/repositories/helpers";

describe(DbUserExistsRepository.name, () => {
  it("should return true if user exists", async () => {
    await new TestDb().run(async (knex) => {
      // given
      const sut = new DbUserExistsRepository(knex);
      const user = new UserBuilder().build();
      await insertUser(knex, user);

      // when
      const exists = await sut.exists(user.email);

      // then
      expect(exists).toBeTruthy();
    });
  });

  it("should return false if no user is found", async () => {
    await new TestDb().run(async (knex) => {
      // given
      const sut = new DbUserExistsRepository(knex);
      const email = faker.internet.email();

      // when
      const exists = await sut.exists(email);

      // then
      expect(exists).toBeFalsy();
    });
  });
});
