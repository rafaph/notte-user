import { Global, Module, Provider } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { CqrsModule } from "@nestjs/cqrs";
import { KnexModule } from "nest-knexjs";
import { LoggerModule } from "nestjs-pino";

import {
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  UpdateUserCommandHandler,
  VerifyUserCommandHandler,
} from "@/application/handlers/commands";
import { PasswordService } from "@/application/services";
import { AppConfig } from "@/config";
import {
  CreateUserRepository,
  DeleteUserRepository,
  FindUserByEmailRepository,
  FindUserByIdRepository,
  UpdateUserRepository,
} from "@/domain/repositories";
import {
  appConfigFactory,
  knexModuleFactory,
  loggerModuleFactory,
} from "@/factories";
import {
  CreateUserController,
  DeleteUserController,
  VerifyUserController,
  UpdateUserController,
} from "@/infrastructure/http/controllers";
import {
  DbCreateUserRepository,
  DbDeleteUserRepository,
  DbFindUserByEmailRepository,
  DbFindUserByIdRepository,
  DbUpdateUserRepository,
} from "@/infrastructure/repositories";
import { Argon2PasswordService } from "@/infrastructure/services";

const Repositories: Provider[] = [
  {
    provide: CreateUserRepository,
    useClass: DbCreateUserRepository,
  },
  {
    provide: FindUserByEmailRepository,
    useClass: DbFindUserByEmailRepository,
  },
  {
    provide: FindUserByIdRepository,
    useClass: DbFindUserByIdRepository,
  },
  {
    provide: UpdateUserRepository,
    useClass: DbUpdateUserRepository,
  },
  {
    provide: DeleteUserRepository,
    useClass: DbDeleteUserRepository,
  },
];

const Handlers: Provider[] = [
  CreateUserCommandHandler,
  VerifyUserCommandHandler,
  UpdateUserCommandHandler,
  DeleteUserCommandHandler,
];

const Services: Provider[] = [
  {
    provide: PasswordService,
    useClass: Argon2PasswordService,
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
  ...Repositories,
  ...Services,
  ...Handlers,
];

const Controllers: ModuleMetadata["controllers"] = [
  CreateUserController,
  VerifyUserController,
  UpdateUserController,
  DeleteUserController,
];

@Global()
@Module({
  imports: Modules,
  providers: Providers,
  controllers: Controllers,
  exports: [AppConfig],
})
export class AppModule {}
