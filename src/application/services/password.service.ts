export abstract class PasswordService {
  public abstract hash(password: string): Promise<string>;
  public abstract verify(hash: string, password: string): Promise<boolean>;
}
