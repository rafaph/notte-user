import { Transform } from "class-transformer";
import { IsInt, IsUrl } from "class-validator";

import { toInt } from "@/shared/transformers";

export class DatabaseConfig {
  @IsUrl({
    require_protocol: true,
    protocols: ["postgresql"],
    require_tld: false,
  })
  public readonly url!: string;

  @IsInt()
  @Transform(toInt)
  public readonly poolMin!: number;

  @IsInt()
  @Transform(toInt)
  public readonly poolMax!: number;
}
