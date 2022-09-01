import { injectable } from "inversify";
import { Option, None, Some } from "oxide.ts";
import { Pool } from "pg";

import { User } from "@/domain/entities/user";
import { GetUserByEmailRepository } from "@/domain/repositories/get-user-by-email-repository";
import {
  UserMapper,
  UserDb,
} from "@/infra/repositories/pg/mappers/user-mapper";

@injectable()
export class PgGetUserByEmailRepository implements GetUserByEmailRepository {
  public readonly QUERY_STATEMENT = `SELECT * FROM users WHERE email = $1;`;

  public constructor(private readonly pool: Pool) {}

  public async getByEmail(email: string): Promise<Option<User>> {
    const { rows } = await this.pool.query(this.QUERY_STATEMENT, [email]);

    if (rows.length === 0) {
      return None;
    }

    const user = UserMapper.toUser(rows[0] as UserDb);

    return Some(user);
  }
}
