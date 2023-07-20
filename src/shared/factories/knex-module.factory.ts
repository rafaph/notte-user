import { KnexModuleOptions } from "nest-knexjs";

import { AppConfig } from "@/shared/config";

export function knexModuleFactory({ database }: AppConfig): KnexModuleOptions {
  return {
    config: {
      client: "mysql2",
      connection: {
        host: database.host,
        port: database.port,
        user: database.user,
        password: database.password,
        database: database.name,
      },
      pool: {
        min: database.pool.min,
        max: database.pool.max,
      },
    },
  };
}
