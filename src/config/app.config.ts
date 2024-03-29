import { Injectable } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsIn, IsIP, IsPort, ValidateNested } from "class-validator";

import { Argon2Config } from "@/config/argon2.config";
import { DatabaseConfig } from "@/config/database.config";
import { LoggerConfig } from "@/config/logger.config";

@Injectable()
export class AppConfig {
  @IsIn(["development", "production", "test"])
  public readonly env!: string;

  @IsPort()
  public readonly port!: string;

  @IsIP()
  public readonly host!: string;

  @ValidateNested()
  @Type(() => LoggerConfig)
  public readonly logger!: LoggerConfig;

  @ValidateNested()
  @Type(() => DatabaseConfig)
  public readonly database!: DatabaseConfig;

  @ValidateNested()
  @Type(() => Argon2Config)
  public readonly argon2!: Argon2Config;
}
