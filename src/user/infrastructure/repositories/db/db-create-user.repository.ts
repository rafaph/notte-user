import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectConnection } from "nest-knexjs";

import { User } from "@/user/domain/models/user";
import { CreateUserRepository } from "@/user/domain/repositories/create-user.repository";

@Injectable()
export class DbCreateUserRepository implements CreateUserRepository {
  public constructor(@InjectConnection() private readonly knex: Knex) {}

  public async create(user: User): Promise<void> {
    await this.knex("users").insert({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
