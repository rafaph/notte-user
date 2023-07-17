import { Global, Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { Pool } from "pg";

import { AppConfig } from "@/shared/config";
import {
  appConfigFactory,
  loggerModuleFactory,
  poolFactory,
} from "@/shared/factories";

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: loggerModuleFactory,
      inject: [AppConfig],
    }),
  ],
  providers: [
    {
      provide: AppConfig,
      useFactory: appConfigFactory,
    },
    {
      provide: Pool,
      useFactory: poolFactory,
      inject: [AppConfig],
    },
  ],
  exports: [AppConfig, Pool],
})
export class SharedModule {}
