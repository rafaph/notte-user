import { Transform, Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { toInt } from "@/shared/application/transformers";

export class PoolConfig {
  @IsInt()
  @Transform(toInt)
  public readonly min!: number;

  @IsInt()
  @Transform(toInt)
  public readonly max!: number;
}

export class DatabaseConfig {
  @IsNotEmpty()
  public readonly host!: string;

  @IsInt()
  @Transform(toInt)
  public readonly port!: number;

  @IsNotEmpty()
  public readonly user!: string;

  @IsNotEmpty()
  public readonly password!: string;

  @IsNotEmpty()
  public readonly name!: string;

  @ValidateNested()
  @Type(() => PoolConfig)
  public readonly pool!: PoolConfig;
}
