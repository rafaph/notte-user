import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { omit } from "lodash";
import { InjectConnection } from "nest-knexjs";

import { User, UserProps } from "@/domain/models/user";
import { CreateUserRepository } from "@/domain/repositories";

@Injectable()
export class DbCreateUserRepository implements CreateUserRepository {
  public constructor(@InjectConnection() private readonly knex: Knex) {}

  public async create(user: User): Promise<void> {
    await this.knex<UserProps>("users").insert({
      ...omit(user, ["update"]),
    });
  }
}
