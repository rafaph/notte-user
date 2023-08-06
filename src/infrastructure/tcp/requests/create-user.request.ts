import { IsEmail, IsString, Length, IsStrongPassword } from "class-validator";

import { CreateUserCommand } from "@/application/commands";
import { EqualsToProperty } from "@/application/validators";

export class CreateUserRequest {
  @IsString()
  @Length(2, 100)
  public firstName!: string;

  @IsString()
  @Length(2, 100)
  public lastName!: string;

  @IsEmail()
  public email!: string;

  @IsString()
  @IsStrongPassword()
  public password!: string;

  @IsString()
  @EqualsToProperty("password")
  public passwordConfirmation!: string;

  public toCommand(): CreateUserCommand {
    return new CreateUserCommand({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    });
  }
}
