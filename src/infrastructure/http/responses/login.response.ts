import { LoginResult } from "@/application/queries/results";

export class LoginResponse {
  public token: string;

  private constructor(token: string) {
    this.token = token;
  }

  public static fromResult(result: LoginResult): LoginResponse {
    return new LoginResponse(result.token);
  }
}
