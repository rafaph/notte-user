import { Knex } from "knex";

import { User } from "@/user/domain/models";

export async function insertUser(knex: Knex, user: User): Promise<void> {
  await knex("users").insert(user);
}
