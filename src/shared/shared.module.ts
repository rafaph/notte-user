import { Global, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { KnexModule } from "nest-knexjs";
import { LoggerModule } from "nestjs-pino";

import { PasswordHasherService } from "@/shared/application/services";
import { AppConfig } from "@/shared/config";
import {
  appConfigFactory,
  knexModuleFactory,
  loggerModuleFactory,
} from "@/shared/factories";
import { Argon2PasswordHasherService } from "@/shared/infrastructure/services";

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
    {
      provide: PasswordHasherService,
      useClass: Argon2PasswordHasherService,
    },
  ],
  exports: [CqrsModule, AppConfig, PasswordHasherService],
})
export class SharedModule {}
