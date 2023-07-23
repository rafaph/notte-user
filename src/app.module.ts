import { Global, Module, Provider } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { CqrsModule } from "@nestjs/cqrs";
import { KnexModule } from "nest-knexjs";
import { LoggerModule } from "nestjs-pino";

import { CreateUserCommandHandler } from "@/application/handlers/commands";
import {
  LoginQueryHandler,
  VerifyTokenQueryHandler,
} from "@/application/handlers/queries";
import { PasswordService, TokenService } from "@/application/services";
import { AppConfig } from "@/config";
import {
  CreateUserRepository,
  FindUserByEmailRepository,
} from "@/domain/repositories";
import {
  appConfigFactory,
  knexModuleFactory,
  loggerModuleFactory,
} from "@/factories";
import {
  CreateUserController,
  LoginController,
} from "@/infrastructure/http/controllers";
import { JwtAuthGuard } from "@/infrastructure/http/guards";
import {
  DbCreateUserRepository,
  DbFindUserByEmailRepository,
} from "@/infrastructure/repositories";
import {
  Argon2PasswordService,
  JwtTokenService,
} from "@/infrastructure/services";

const Repositories: Provider[] = [
  {
    provide: CreateUserRepository,
    useClass: DbCreateUserRepository,
  },
  {
    provide: FindUserByEmailRepository,
    useClass: DbFindUserByEmailRepository,
  },
];

const Handlers: Provider[] = [
  CreateUserCommandHandler,
  LoginQueryHandler,
  VerifyTokenQueryHandler,
];

const Services: Provider[] = [
  {
    provide: PasswordService,
    useClass: Argon2PasswordService,
  },
  {
    provide: TokenService,
    useClass: JwtTokenService,
  },
];

const Modules: ModuleMetadata["imports"] = [
  CqrsModule,
  LoggerModule.forRootAsync({
    useFactory: loggerModuleFactory,
    inject: [AppConfig],
  }),
  KnexModule.forRootAsync({
    useFactory: knexModuleFactory,
    inject: [AppConfig],
  }),
];

const Providers: ModuleMetadata["providers"] = [
  {
    provide: AppConfig,
    useFactory: appConfigFactory,
  },
  JwtAuthGuard,
  ...Repositories,
  ...Services,
  ...Handlers,
];

const Controllers: ModuleMetadata["controllers"] = [
  CreateUserController,
  LoginController,
];

@Global()
@Module({
  imports: Modules,
  providers: Providers,
  controllers: Controllers,
  exports: [AppConfig],
})
export class AppModule {}
