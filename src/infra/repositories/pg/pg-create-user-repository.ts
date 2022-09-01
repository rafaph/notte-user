import { injectable } from "inversify";
import { Pool } from "pg";

import { User } from "@/domain/entities/user";
import { CreateUserRepository } from "@/domain/repositories/create-user-repository";
import { UserMapper } from "@/infra/repositories/pg/mappers/user-mapper";

@injectable()
export class PgCreateUserRepository implements CreateUserRepository {
  public readonly INSERT_STATEMENT = `INSERT INTO users(id, email, password, "createdAt", "updatedAt")
                              VALUES ($1, $2, $3, $4, $5)`;

  public constructor(private readonly pool: Pool) {}

  public async create(user: User): Promise<void> {
    const userDb = UserMapper.toDb(user);

    await this.pool.query(this.INSERT_STATEMENT, [
      userDb.id,
      userDb.email,
      userDb.password,
      userDb.createdAt,
      userDb.updatedAt,
    ]);
  }
}
