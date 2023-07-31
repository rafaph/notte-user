import { Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { AppConfig } from "@/config";
import { InvalidConfigurationError } from "@/domain/errors";

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
    jwt: {
      expiresIn: process.env.JWT_EXPIRES_IN,
      algorithm: process.env.JWT_ALGORITHM,
      publicKey: process.env.JWT_PUBLIC_KEY,
      privateKey: process.env.JWT_PRIVATE_KEY,
    },
    argon2: {
      secret: process.env.ARGON2_SECRET,
    },
  };
  const config = plainToInstance(AppConfig, plainConfig);
  const errors = validateSync(config);

  /* istanbul ignore next */
  if (errors.length > 0) {
    logger.error("Invalid configuration, errors = ", errors);
    throw new InvalidConfigurationError();
  }

  /* istanbul ignore next */
  if (!config.logger.disabled) {
    logger.log("Valid configuration, continuing...");
  }

  return config;
}
