export class EmailAlreadyInUseError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "EmailAlreadyInUseError";
  }
}
