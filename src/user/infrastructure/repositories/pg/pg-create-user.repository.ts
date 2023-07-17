import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

import { User } from "@/user/domain/models/user";
import { CreateUserRepository } from "@/user/domain/repositories/create-user.repository";

@Injectable()
export class PgCreateUserRepository implements CreateUserRepository {
  public constructor(private readonly pool: Pool) {}

  public async create(user: User): Promise<void> {
    const queryText =
      'INSERT INTO users (id, firstName, lastName, email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt,
    ];
    await this.pool.query(queryText, values);
  }
}
