import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppModule } from "@/app.module";
import { AppConfig } from "@/shared/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  const { port } = app.get(AppConfig);

  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
    }),
  );
  app.enableVersioning();
  app.setGlobalPrefix("api");

  await app.listen(port, () => {
    logger.log(`Listening on port ${port}`, "Bootstrap");
  });
}

void bootstrap();
