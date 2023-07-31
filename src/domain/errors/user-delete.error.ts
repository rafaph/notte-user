export class UserDeleteError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "UserDeleteError";
  }
}
