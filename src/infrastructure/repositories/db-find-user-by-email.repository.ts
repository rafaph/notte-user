import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectConnection } from "nest-knexjs";
import { None, Option, Some } from "oxide.ts";

import { User, UserProps } from "@/domain/models";
import { FindUserByEmailRepository } from "@/domain/repositories";

@Injectable()
export class DbFindUserByEmailRepository implements FindUserByEmailRepository {
  public constructor(@InjectConnection() private readonly knex: Knex) {}

  public async findByEmail(email: string): Promise<Option<User>> {
    const rows = await this.knex
      .select("*")
      .from("users")
      .where<UserProps[]>("email", email);

    if (rows.length === 0) {
      return None;
    }

    const [userProps] = rows;
    const user = new User(userProps);

    return Some(user);
  }
}
