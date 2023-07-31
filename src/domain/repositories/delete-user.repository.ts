export abstract class DeleteUserRepository {
  public abstract delete(userId: string): Promise<void>;
}
