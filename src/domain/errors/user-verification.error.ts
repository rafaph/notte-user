export class UserVerificationError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "UserVerificationError";
  }
}
