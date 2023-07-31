import { faker } from "@faker-js/faker";

import { DbUpdateUserRepository } from "@/infrastructure/repositories";

import { UserBuilder } from "@test/builders";
import { TestDb } from "@test/helpers";
import {
  insertUser,
  queryUser,
} from "@test/infrastructure/repositories/helpers";

describe(DbUpdateUserRepository.name, () => {
  it("should update user", async () => {
    await new TestDb().run(async (knex) => {
      // given
      const sut = new DbUpdateUserRepository(knex);
      const user = new UserBuilder().build();
      await insertUser(knex, user);
      user.update({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      });

      // when
      await sut.update(user);

      // then
      const [dbUser] = await queryUser(knex, { id: user.id });
      expect(user).toEqual(dbUser);
    });
  });
});
