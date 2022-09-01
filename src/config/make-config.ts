import { ConfigType } from "@/config/config-schema";
import { Env } from "@/config/env";

export const makeConfig = (): ConfigType => ({
  env: process.env[Env.NODE_ENV] as ConfigType["env"],
  host: process.env[Env.HOST] as string,
  port: parseInt(process.env[Env.PORT] as string, 10),
  db: {
    url: process.env[Env.DATABASE_URL] as string,
    pool: {
      min: parseInt(process.env[Env.DATABASE_POOL_MIN] as string, 10),
      max: parseInt(process.env[Env.DATABASE_POOL_MAX] as string, 10),
    },
  },
});
