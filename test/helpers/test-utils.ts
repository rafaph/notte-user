import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectConnection } from "nest-knexjs";

@Injectable()
export class TestUtils {
  public constructor(@InjectConnection() public readonly knex: Knex) {}
}
