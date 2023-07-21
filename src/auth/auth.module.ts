import { Module } from "@nestjs/common";

import { LoginQueryHandler } from "@/auth/application/handlers/queries";
import { GetCredentialsRepository } from "@/auth/domain/repositories";
import { DbGetCredentialsRepository } from "@/auth/infrastructure/repositories/db";

@Module({
  providers: [
    {
      provide: GetCredentialsRepository,
      useClass: DbGetCredentialsRepository,
    },
    LoginQueryHandler,
  ],
})
export class AuthModule {}
