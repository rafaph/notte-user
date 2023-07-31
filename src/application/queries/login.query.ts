export class LoginQuery {
  public constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
