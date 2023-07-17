import { Pool } from "pg";

import { AppConfig } from "@/shared/config";

export function poolFactory(config: AppConfig): Pool {
  return new Pool({
    connectionString: config.database.url,
    min: config.database.poolMin,
    max: config.database.poolMax,
  });
}
