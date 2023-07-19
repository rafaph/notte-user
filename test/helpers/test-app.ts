import { Server } from "http";

import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Pool } from "pg";

import { App } from "@/app";
import { AppModule } from "@/app.module";

import { TestDb } from "@test/helpers/test-db";

export class TestApp extends App {
  private readonly testDb = new TestDb();

  protected async init(): Promise<void> {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Pool)
      .useValue(this.testDb.pool)
      .compile();

    this.app = testingModule.createNestApplication({
      bufferLogs: true,
    });
    this.configure();
    await this.app.init();
  }

  private async up(): Promise<void> {
    await this.testDb.up();
    await this.init();
  }

  private async down(): Promise<void> {
    await this.app.close();
    await this.testDb.down();
  }

  public async run(
    callback: (app: INestApplication<Server>) => Promise<void>,
  ): Promise<void> {
    try {
      await this.up();
      await callback(this.app as INestApplication<Server>);
    } finally {
      await this.down();
    }
  }
}
