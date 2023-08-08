import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectConnection } from "nest-knexjs";

import { User, UserProps } from "@/domain/models";
import { FindUserByEmailRepository } from "@/domain/repositories";

@Injectable()
export class DbFindUserByEmailRepository implements FindUserByEmailRepository {
  public constructor(@InjectConnection() private readonly knex: Knex) {}

  public async findByEmail(email: string): Promise<User | null> {
    const rows = await this.knex
      .select("*")
      .from("users")
      .where<UserProps[]>("email", email);

    if (rows.length === 0) {
      return null;
    }

    const [userProps] = rows;

    return new User(userProps);
  }
}
