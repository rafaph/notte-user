import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectConnection } from "nest-knexjs";

import { User, UserProps } from "@/user/domain/models/user";
import { CreateUserRepository } from "@/user/domain/repositories/create-user.repository";

@Injectable()
export class DbCreateUserRepository implements CreateUserRepository {
  public constructor(@InjectConnection() private readonly knex: Knex) {}

  public async create(user: User): Promise<void> {
    await this.knex<UserProps>("users").insert({
      ...user,
    });
  }
}