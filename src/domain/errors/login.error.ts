export class LoginError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "LoginError";
  }
}
