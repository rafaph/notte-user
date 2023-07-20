import { Transform } from "class-transformer";
import { IsBoolean, IsIn, IsOptional } from "class-validator";

import { toBoolean } from "@/shared/application/transformers";

export class LoggerConfig {
  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  public readonly disabled!: boolean;

  @IsIn(["verbose", "debug", "log", "warn", "error"])
  public readonly level!: string;
}
