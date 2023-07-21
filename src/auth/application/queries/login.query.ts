import { WritableCredentialsProps } from "@/auth/domain/model";

export class LoginQuery {
  public constructor(
    public readonly credentialsProps: WritableCredentialsProps,
  ) {}
}
