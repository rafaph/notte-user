export class TokenVerificationError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "TokenVerificationError";
  }
}
