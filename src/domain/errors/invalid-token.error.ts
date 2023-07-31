export class InvalidTokenError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "InvalidTokenError";
  }
}
