import { Injectable } from "@nestjs/common";
import { Pool, QueryResult } from "pg";

import { UserExistsRepository } from "@/user/domain/repositories";

@Injectable()
export class PgUserExistsRepository implements UserExistsRepository {
  public constructor(private readonly pool: Pool) {}

  public async exists(email: string): Promise<boolean> {
    const queryText = "SELECT COUNT(*) AS count FROM users WHERE email = $1";
    const values = [email];
    const result: QueryResult<{ count: number }> = await this.pool.query(
      queryText,
      values,
    );
    const { count } = result.rows[0];

    return count > 0;
  }
}
