import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { CreateUserCommandHandler } from "@/user/application/handlers";
import { PasswordHasherService } from "@/user/application/services";
import {
  CreateUserRepository,
  UserExistsRepository,
} from "@/user/domain/repositories";
import { CreateUserController } from "@/user/infrastructure/http/controllers";
import {
  DbCreateUserRepository,
  DbUserExistsRepository,
} from "@/user/infrastructure/repositories/db";
import { Argon2PasswordHasherService } from "@/user/infrastructure/services";

@Module({
  imports: [CqrsModule],
  providers: [
    {
      provide: UserExistsRepository,
      useClass: DbUserExistsRepository,
    },
    {
      provide: CreateUserRepository,
      useClass: DbCreateUserRepository,
    },
    {
      provide: PasswordHasherService,
      useClass: Argon2PasswordHasherService,
    },
    CreateUserCommandHandler,
  ],
  controllers: [CreateUserController],
})
export class UserModule {}
