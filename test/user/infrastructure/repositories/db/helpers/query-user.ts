import { Knex } from "knex";

import { User, UserProps } from "@/user/domain/models";

export async function queryUser<K extends keyof UserProps>(
  knex: Knex,
  criteria: { [key in K]: UserProps[K] },
): Promise<User[]> {
  if (Object.keys(criteria).length === 0) {
    throw new Error("Criteria cannot be an empty object.");
  }

  const rows = await knex<UserProps>("users").where(criteria).select("*");

  return rows.map((row) => new User(row));
}
