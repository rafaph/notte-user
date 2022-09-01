export abstract class PasswordVerifierService {
  public abstract verify(password: string, hash: string): Promise<boolean>;
}
