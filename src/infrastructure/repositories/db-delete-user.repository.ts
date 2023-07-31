import { Knex } from "knex";
import { InjectConnection } from "nest-knexjs";

import { DeleteUserRepository } from "@/domain/repositories";

export class DbDeleteUserRepository implements DeleteUserRepository {
  public constructor(@InjectConnection() private readonly knex: Knex) {}

  public async delete(userId: string): Promise<void> {
    await this.knex("users").where("id", userId).delete();
  }
}
