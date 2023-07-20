import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectConnection } from "nest-knexjs";

import { UserExistsRepository } from "@/user/domain/repositories";

@Injectable()
export class DbUserExistsRepository implements UserExistsRepository {
  public constructor(@InjectConnection() private readonly knex: Knex) {}

  public async exists(email: string): Promise<boolean> {
    const result = await this.knex("users")
      .count("* as count")
      .where<Array<{ count: number }>>("email", email);

    return result[0].count > 0;
  }
}
