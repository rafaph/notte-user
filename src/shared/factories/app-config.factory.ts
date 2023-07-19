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
      url: process.env.DATABASE_URL,
      poolMin: process.env.DATABASE_POOL_MIN,
      poolMax: process.env.DATABASE_POOL_MAX,
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
