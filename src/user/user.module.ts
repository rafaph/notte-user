import { Module } from "@nestjs/common";

import { CreateUserCommandHandler } from "@/user/application/handlers";
import {
  CreateUserRepository,
  UserExistsRepository,
} from "@/user/domain/repositories";
import { CreateUserController } from "@/user/infrastructure/http/controllers";
import {
  DbCreateUserRepository,
  DbUserExistsRepository,
} from "@/user/infrastructure/repositories/db";

@Module({
  providers: [
    {
      provide: UserExistsRepository,
      useClass: DbUserExistsRepository,
    },
    {
      provide: CreateUserRepository,
      useClass: DbCreateUserRepository,
    },
    CreateUserCommandHandler,
  ],
  controllers: [CreateUserController],
})
export class UserModule {}
