import { Knex } from "knex";

import { User, UserProps } from "@/user/domain/models";

export async function queryUser(
  knex: Knex,
  criteria: { [key: string]: unknown },
): Promise<User[]> {
  const rows = await knex("users").where(criteria).select("*");

  if (rows.length === 0) {
    throw new Error("No users found.");
  }

  return rows.map((row) => new User(row as UserProps));
}
