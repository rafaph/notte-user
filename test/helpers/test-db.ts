import { spawn } from "child_process";
import { randomUUID } from "crypto";
import * as path from "path";

import { ConnectionString } from "connection-string";
import { Client, Pool } from "pg";

const makeQuery = async (query: string): Promise<void> => {
  const { DATABASE_URL } = process.env;

  if (!DATABASE_URL) {
    throw new Error("Unable to perform query without DATABASE_URL.");
  }

  const client = new Client(DATABASE_URL);
  await client.connect();
  await client.query(query);
  await client.end();
};

const createDatabase = (database: string): Promise<void> => {
  return makeQuery(`CREATE DATABASE ${database};`);
};

const dropDatabase = (database: string): Promise<void> => {
  return makeQuery(`DROP DATABASE IF EXISTS ${database};`);
};

const createTables = (databaseUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = spawn("bin/migrate", {
      env: {
        DATABASE_URL: databaseUrl,
      },
      cwd: path.join(__dirname, "..", ".."),
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error("Failed to create tables."));
      }
    });
  });
};

export class TestDb {
  private readonly name = `test_${randomUUID().toString().replaceAll("-", "")}`;
  public pool!: Pool;

  public get url(): string {
    const connectionString = new ConnectionString(process.env.DATABASE_URL);
    connectionString.path = [this.name];

    return connectionString.toString();
  }

  public async up(): Promise<void> {
    await createDatabase(this.name);
    await createTables(this.url);
    this.pool = new Pool({
      connectionString: this.url,
      min: 1,
      max: 1,
    });
  }

  public async down(): Promise<void> {
    await this.pool.end();
    await dropDatabase(this.name);
  }

  public async run(callback: (pool: Pool) => Promise<void>): Promise<void> {
    try {
      await this.up();
      await callback(this.pool);
    } finally {
      await this.down();
    }
  }
}
