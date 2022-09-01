import { injectable } from "inversify";

import { ConfigSchema, ConfigType } from "@/config/config-schema";
import { makeConfig } from "@/config/make-config";
import { Logger } from "@/lib/logger";
import { safeParse } from "@/lib/validator";

@injectable()
export class Config implements ConfigType {
  public readonly env!: ConfigType["env"];
  public readonly host!: ConfigType["host"];
  public readonly port!: ConfigType["port"];
  public readonly db!: ConfigType["db"];

  public constructor() {
    const result = safeParse(ConfigSchema, makeConfig());

    if (!result.success) {
      Logger.error({ errors: result.error.errors }, "Invalid config...");

      throw new Error("Invalid config...");
    }

    Object.assign(this, result.data);
  }
}
