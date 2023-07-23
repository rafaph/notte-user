import { BadRequestException } from "@nestjs/common";
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  ValidateIf,
} from "class-validator";
import { omitBy } from "lodash";

import { UpdateUserCommand } from "@/application/commands";
import { EqualsToProperty } from "@/application/validators";

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  public firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  public lastName?: string;

  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  public password?: string;

  @ValidateIf(
    (request: UpdateUserRequest) => typeof request.password !== "undefined",
  )
  @IsString()
  @EqualsToProperty("password")
  public passwordConfirmation?: string;

  public toCommand(id: string): UpdateUserCommand {
    const props: Omit<UpdateUserCommand["userProps"], "id"> = omitBy(
      {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      },
      (value) => typeof value === "undefined" || value === null,
    );

    if (Object.keys(props).length === 0) {
      throw new BadRequestException(
        "Please inform at least one user property.",
      );
    }

    return new UpdateUserCommand({
      ...props,
      id,
    });
  }
}
