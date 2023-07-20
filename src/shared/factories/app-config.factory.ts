import { Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { AppConfig } from "@/shared/config";
import { InvalidConfigurationError } from "@/shared/errors";

export function appConfigFactory(): AppConfig {
  const logger = new Logger(AppConfig.name);
  const plainConfig = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    host: process.env.HOST,
    logger: {
      disabled: process.env.LOG_DISABLED,
      level: process.env.LOG_LEVEL,
    },
    database: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      name: process.env.DATABASE_NAME,
      pool: {
        min: process.env.DATABASE_POOL_MIN,
        max: process.env.DATABASE_POOL_MAX,
      },
    },
  };
  const config = plainToInstance(AppConfig, plainConfig);
  const errors = validateSync(config);

  /* istanbul ignore next */
  if (errors.length > 0) {
    logger.error("Invalid configuration, errors = ", errors);
    throw new InvalidConfigurationError();
  }

  logger.log("Valid configuration, continuing...");

  return config;
}
