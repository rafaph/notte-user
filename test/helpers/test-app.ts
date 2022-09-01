import { Pool } from "pg";

import { TestDb } from "@test/helpers/test-db";
import { TestServer } from "@test/helpers/test-server";

export class TestApp {
  private readonly db: TestDb;
  private readonly server: TestServer;

  public constructor(env: NodeJS.ProcessEnv = {}) {
    this.db = new TestDb();
    this.server = new TestServer({
      ...env,
      DATABASE_URL: this.db.url,
    });
  }

  private async up(): Promise<void> {
    await this.db.up();
    await this.server.up();
  }

  private async down(): Promise<void> {
    await this.server.down();
    await this.db.down();
  }

  public async run(
    callback: (address: string, pool: Pool) => Promise<void>,
  ): Promise<void> {
    try {
      await this.up();
      await callback(this.server.address, this.db.pool);
    } finally {
      await this.down();
    }
  }
}
