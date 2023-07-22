import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectConnection } from "nest-knexjs";
import { None, Option, Some } from "oxide.ts";

import { Credentials, CredentialsProps } from "@/domain/models";
import { GetCredentialsRepository } from "@/domain/repositories";

@Injectable()
export class DbGetCredentialsRepository implements GetCredentialsRepository {
  public constructor(@InjectConnection() private readonly knex: Knex) {}

  public async get(email: string): Promise<Option<Credentials>> {
    const rows = await this.knex
      .select("id", "email", "password")
      .from("users")
      .where<CredentialsProps[]>("email", email);

    if (rows.length === 0) {
      return None;
    }

    const [credentialsProps] = rows;
    const credentials = new Credentials(credentialsProps);

    return Some(credentials);
  }
}
