import { Knex } from "knex";

import { User, UserProps } from "@/user/domain/models";

export async function insertUser(knex: Knex, user: User): Promise<void> {
  await knex<UserProps>("users").insert(user);
}
