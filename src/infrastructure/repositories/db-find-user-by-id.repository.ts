import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectConnection } from "nest-knexjs";
import { None, Option, Some } from "oxide.ts";

import { User, UserProps } from "@/domain/models";
import { FindUserByIdRepository } from "@/domain/repositories";

@Injectable()
export class DbFindUserByIdRepository implements FindUserByIdRepository {
  public constructor(@InjectConnection() private readonly knex: Knex) {}

  public async findById(id: string): Promise<Option<User>> {
    const rows = await this.knex
      .select("*")
      .from("users")
      .where<UserProps[]>("id", id);

    if (rows.length === 0) {
      return None;
    }

    const [userProps] = rows;
    const user = new User(userProps);

    return Some(user);
  }
}
