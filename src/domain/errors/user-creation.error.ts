export class UserCreationError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "UserCreationError";
  }
}
