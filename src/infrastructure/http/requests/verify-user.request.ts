import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { VerifyUserCommand } from "@/application/commands";

export class VerifyUserRequest {
  @IsEmail()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  public password!: string;

  public toCommand(): VerifyUserCommand {
    return new VerifyUserCommand(this.email, this.password);
  }
}
