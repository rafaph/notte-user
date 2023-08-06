import { INestMicroservice, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Transport, TcpOptions } from "@nestjs/microservices";
import { Logger } from "nestjs-pino";

import { AppModule } from "@/app.module";
import { AppConfig } from "@/config";
import { appConfigFactory } from "@/factories";
import { HttpExceptionFilter } from "@/infrastructure/tcp/exception-filters";
import { RpcResponseInterceptor } from "@/infrastructure/tcp/interceptors";

export class App {
  protected app!: INestMicroservice;
  protected config!: AppConfig;

  /* istanbul ignore next */
  protected async init(): Promise<void> {
    this.config = appConfigFactory();
    this.app = await NestFactory.createMicroservice<TcpOptions>(AppModule, {
      bufferLogs: true,
      transport: Transport.TCP,
      options: {
        host: this.config.host,
        port: parseInt(this.config.port, 10),
      },
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
    this.app.useGlobalFilters(new HttpExceptionFilter());
    this.app.useGlobalInterceptors(new RpcResponseInterceptor());
  }

  /* istanbul ignore next */
  public async listen(): Promise<void> {
    await this.app.listen();
    const logger = this.app.get(Logger);
    logger.log(`Listening at tcp://${this.config.host}:${this.config.port}`);
  }

  /* istanbul ignore next */
  public static async create(): Promise<App> {
    const app = new App();
    await app.init();

    return app;
  }
}
