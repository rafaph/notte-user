import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { omit } from "lodash";
import { InjectConnection } from "nest-knexjs";

import { User, UserProps } from "@/domain/models/user";
import { UpdateUserRepository } from "@/domain/repositories";

@Injectable()
export class DbUpdateUserRepository implements UpdateUserRepository {
  public constructor(@InjectConnection() private readonly knex: Knex) {}

  public async update(user: User): Promise<void> {
    await this.knex<UserProps>("users")
      .where("id", user.id)
      .update({
        ...omit(user, ["id", "update"]),
      });
  }
}
