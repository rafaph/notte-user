import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsStrongPassword,
} from "class-validator";

import { CreateUserCommand } from "@/user/application/commands";
import { EqualsToProperty } from "@/user/domain/validators";

export class CreateUserRequest {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  public firstName!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
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
