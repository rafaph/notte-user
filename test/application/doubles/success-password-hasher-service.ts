import { PasswordHasherService } from "@/domain/services/password-hasher-service";

export class SuccessPasswordHasherService implements PasswordHasherService {
  public constructor(public readonly hashedPassword = "hashed-password") {}

  public async hash(): Promise<string> {
    return this.hashedPassword;
  }
}
