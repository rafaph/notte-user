export class VerifyUserCommand {
  public constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
