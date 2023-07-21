import { PasswordService } from "@/shared/application/services";

export class PasswordServiceMock implements PasswordService {
  public async hash(password: string): Promise<string> {
    return `hashed_${password}`;
  }

  public async verify(hash: string, password: string): Promise<boolean> {
    return hash.substring(7) === password;
  }
}
