import { faker } from "@faker-js/faker";

import { DbFindUserByIdRepository } from "@/infrastructure/repositories";

import { UserBuilder } from "@test/builders";
import { TestDb } from "@test/helpers";
import { insertUser } from "@test/infrastructure/repositories/helpers";

describe(DbFindUserByIdRepository.name, () => {
  it("should return an user", async () => {
    await new TestDb().run(async (knex) => {
      // given
      const sut = new DbFindUserByIdRepository(knex);
      const user = new UserBuilder().build();
      await insertUser(knex, user);

      // when
      const userResult = await sut.findById(user.id);

      // then
      expect(userResult).toBeTruthy();
    });
  });

  it("should not return an user", async () => {
    await new TestDb().run(async (knex) => {
      // given
      const sut = new DbFindUserByIdRepository(knex);
      const id = faker.string.uuid();

      // when
      const userResult = await sut.findById(id);

      // then
      expect(userResult).toBeFalsy();
    });
  });
});
