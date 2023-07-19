import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppModule } from "@/app.module";
import { AppConfig } from "@/shared/config";

export class App {
  protected app!: INestApplication;

  /* istanbul ignore next */
  protected async init(): Promise<void> {
    this.app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });
    this.configure();
  }

  protected configure(): void {
    this.app.useLogger(this.app.get(Logger));
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
      }),
    );
    this.app.enableVersioning();
    this.app.setGlobalPrefix("api");
  }

  /* istanbul ignore next */
  public async listen(): Promise<void> {
    const logger = this.app.get(Logger);
    const { port } = this.app.get(AppConfig);
    await this.app.listen(port, () => {
      logger.log(`Listening on port ${port}`, "Bootstrap");
    });
  }

  /* istanbul ignore next */
  public static async create(): Promise<App> {
    const app = new App();
    await app.init();

    return app;
  }
}
