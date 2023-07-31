export class InvalidCredentialsError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}
