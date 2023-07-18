import { Pool } from "pg";

import { User } from "@/user/domain/models";

export async function insertUser(pool: Pool, user: User): Promise<void> {
  const queryText =
    'INSERT INTO users (id, "firstName", "lastName", email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)';
  const values = [
    user.id,
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.createdAt,
    user.updatedAt,
  ];
  await pool.query(queryText, values);
}
