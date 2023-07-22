export abstract class UserExistsRepository {
  public abstract exists(email: string): Promise<boolean>;
}
