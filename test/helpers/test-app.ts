import { INestMicroservice } from "@nestjs/common";
import {
  ClientProxy,
  ClientsModule,
  TcpOptions,
  Transport,
} from "@nestjs/microservices";
import { Test } from "@nestjs/testing";
import { getRandomPort } from "get-port-please";
import { DEFAULT_CONNECTION_NAME } from "nest-knexjs/dist/knex.constants";

import { App } from "@/app";
import { AppModule } from "@/app.module";

import { TestDb } from "@test/helpers/test-db";
import { TestUtils } from "@test/helpers/test-utils";

export class TestApp extends App {
  private readonly testDb = new TestDb();
  private client!: ClientProxy;

  protected async init(): Promise<void> {
    const options = {
      host: "localhost",
      port: await getRandomPort(),
    };
    const testingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          {
            name: "DEFAULT_SERVICE",
            transport: Transport.TCP,
            options,
          },
        ]),
      ],
      providers: [TestUtils],
    })
      .overrideProvider(DEFAULT_CONNECTION_NAME)
      .useValue(this.testDb.knex)
      .compile();

    this.app = testingModule.createNestMicroservice<TcpOptions>({
      bufferLogs: true,
      transport: Transport.TCP,
      options,
    });
    this.configure();
    await this.app.init();
    this.client = this.app.get<ClientProxy>("DEFAULT_SERVICE");
    await this.app.listen();
  }

  private async up(): Promise<void> {
    await this.testDb.up();
    await this.init();
  }

  private async down(): Promise<void> {
    await this.app?.close();
    await this.testDb.down();
  }

  public async run(
    callback: (client: ClientProxy, app: INestMicroservice) => Promise<void>,
  ): Promise<void> {
    try {
      await this.up();
      await callback(this.client, this.app);
    } finally {
      await this.down();
    }
  }
}
