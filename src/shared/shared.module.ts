import { Global, Module } from "@nestjs/common";
import { KnexModule } from "nest-knexjs";
import { LoggerModule } from "nestjs-pino";

import { AppConfig } from "@/shared/config";
import {
  appConfigFactory,
  knexModuleFactory,
  loggerModuleFactory,
} from "@/shared/factories";

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: loggerModuleFactory,
      inject: [AppConfig],
    }),
    KnexModule.forRootAsync({
      useFactory: knexModuleFactory,
      inject: [AppConfig],
    }),
  ],
  providers: [
    {
      provide: AppConfig,
      useFactory: appConfigFactory,
    },
  ],
  exports: [AppConfig],
})
export class SharedModule {}
