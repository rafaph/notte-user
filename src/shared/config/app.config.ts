import { Injectable } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsIn, IsIP, IsPort, ValidateNested } from "class-validator";

import { DatabaseConfig } from "@/shared/config/database.config";

@Injectable()
export class AppConfig {
  @IsIn(["development", "production", "testing"])
  public readonly env!: string;

  @IsPort()
  public readonly port!: string;

  @IsIP()
  public readonly host!: string;

  @IsIn(["verbose", "debug", "log", "warn", "error"])
  public readonly logLevel!: string;

  @ValidateNested()
  @Type(() => DatabaseConfig)
  public readonly database!: DatabaseConfig;
}
