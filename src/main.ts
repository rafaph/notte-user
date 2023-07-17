import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppModule } from "@/app.module";
import { AppConfig } from "@/shared/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableVersioning();
  app.setGlobalPrefix("api");

  const { port } = app.get(AppConfig);
  await app.listen(port);
}

void bootstrap();
