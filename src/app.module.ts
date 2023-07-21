import { Module } from "@nestjs/common";

import { AuthModule } from "@/auth/auth.module";
import { SharedModule } from "@/shared/shared.module";
import { UserModule } from "@/user/user.module";

@Module({
  imports: [SharedModule, AuthModule, UserModule],
})
export class AppModule {}
