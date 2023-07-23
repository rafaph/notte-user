export class UserUpdateError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "UserUpdateError";
  }
}
