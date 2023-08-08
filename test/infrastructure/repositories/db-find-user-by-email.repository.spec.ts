import { faker } from "@faker-js/faker";

import { DbFindUserByEmailRepository } from "@/infrastructure/repositories";

import { UserBuilder } from "@test/builders";
import { TestDb } from "@test/helpers";
import { insertUser } from "@test/infrastructure/repositories/helpers";

describe(DbFindUserByEmailRepository.name, () => {
  it("should return an user", async () => {
    await new TestDb().run(async (knex) => {
      // given
      const sut = new DbFindUserByEmailRepository(knex);
      const user = new UserBuilder().build();
      await insertUser(knex, user);

      // when
      const userResult = await sut.findByEmail(user.email);

      // then
      expect(userResult).toBeTruthy();
    });
  });

  it("should not return an user", async () => {
    await new TestDb().run(async (knex) => {
      // given
      const sut = new DbFindUserByEmailRepository(knex);
      const email = faker.internet.email();

      // when
      const userResult = await sut.findByEmail(email);

      // then
      expect(userResult).toBeFalsy();
    });
  });
});
