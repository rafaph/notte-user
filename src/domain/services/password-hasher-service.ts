export abstract class PasswordHasherService {
  public abstract hash(password: string): Promise<string>;
}
