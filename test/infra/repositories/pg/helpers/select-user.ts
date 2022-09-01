import { Pool } from "pg";

import { User } from "@/domain/entities/user";
import {
  UserDb,
  UserMapper,
} from "@/infra/repositories/pg/mappers/user-mapper";

const SELECT_STATEMENT = `SELECT * FROM users WHERE id = $1`;

export const selectUser = async (pool: Pool, id: string): Promise<User> => {
  const { rows } = await pool.query(SELECT_STATEMENT, [id]);

  if (rows.length !== 1) {
    throw new Error("User not found");
  }

  return UserMapper.toUser(rows[0] as UserDb);
};
