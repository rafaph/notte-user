import { WritableCredentialsProps } from "@/domain/models";

export class LoginQuery {
  public constructor(
    public readonly credentialsProps: WritableCredentialsProps,
  ) {}
}
