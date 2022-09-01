import { Pool } from "pg";

import { User } from "@/domain/entities/user";
import { UserMapper } from "@/infra/repositories/pg/mappers/user-mapper";

const INSERT_STATEMENT = `INSERT INTO users(id, email, password, "createdAt", "updatedAt")
                          VALUES ($1, $2, $3, $4, $5)`;

export const insertUser = async (pool: Pool, user: User): Promise<void> => {
  const userDb = UserMapper.toDb(user);

  await pool.query(INSERT_STATEMENT, [
    userDb.id,
    userDb.email,
    userDb.password,
    userDb.createdAt,
    userDb.updatedAt,
  ]);
};
