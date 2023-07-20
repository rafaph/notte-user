import { execSync } from "child_process";
import { randomUUID } from "crypto";
import * as process from "process";

import { default as knex, Knex } from "knex";
import { createConnection } from "mysql2/promise";

const makeQuery = async (query: string): Promise<void> => {
  const connection = await createConnection({
    user: "root",
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string, 10),
    multipleStatements: true,
  });

  try {
    await connection.query(query);
  } finally {
    await connection.end();
  }
};

const createDatabase = async (database: string): Promise<void> => {
  await makeQuery(
    `CREATE DATABASE ${database};GRANT ALL PRIVILEGES ON ${database}.* TO 'notte'@'%';`,
  );
};

const dropDatabase = (database: string): Promise<void> => {
  return makeQuery(`DROP DATABASE IF EXISTS ${database};`);
};

const createTables = async (databaseName: string): Promise<void> => {
  execSync("bin/migrate", {
    env: {
      ...process.env,
      DATABASE_NAME: databaseName,
    },
    stdio: "ignore",
  });
};

export class TestDb {
  private readonly name = `test_${randomUUID().toString().replaceAll("-", "")}`;
  public knex?: Knex;

  public async up(): Promise<void> {
    await createDatabase(this.name);
    await createTables(this.name);
    this.knex = knex({
      client: "mysql2",
      connection: {
        host: process.env.DATABASE_HOST as string,
        port: parseInt(process.env.DATABASE_PORT as string, 10),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      },
      pool: {
        min: parseInt(process.env.DATABASE_POOL_MIN as string, 10),
        max: parseInt(process.env.DATABASE_POOL_MAX as string, 10),
      },
    });
  }

  public async down(): Promise<void> {
    await this.knex?.destroy();
    await dropDatabase(this.name);
  }

  public async run(callback: (pool: Knex) => Promise<void>): Promise<void> {
    try {
      await this.up();
      await callback(this.knex as Knex);
    } finally {
      await this.down();
    }
  }
}
