import { Pool, QueryResult } from "pg";

import { User, UserProps } from "@/user/domain/models";

export async function queryUser(
  pool: Pool,
  criteria: { [key: string]: unknown },
): Promise<User[]> {
  const where = Object.keys(criteria)
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(` AND `);
  const statement = `SELECT * FROM users WHERE ${where};`;
  const result: QueryResult<UserProps> = await pool.query(
    statement,
    Object.values(criteria),
  );
  const { rows } = result;

  if (rows.length === 0) {
    throw new Error("No users found.");
  }

  return rows.map((row) => new User(row));
}
