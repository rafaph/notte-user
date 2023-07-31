import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { LoginQuery } from "@/application/queries";

export class LoginRequest {
  @IsEmail()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  public password!: string;

  public toQuery(): LoginQuery {
    return new LoginQuery(this.email, this.password);
  }
}
