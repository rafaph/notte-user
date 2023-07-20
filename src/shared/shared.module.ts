import { Global, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
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
    CqrsModule,
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
  exports: [CqrsModule, AppConfig],
})
export class SharedModule {}
