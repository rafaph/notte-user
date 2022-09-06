import { PasswordVerifierService } from "@/domain/services/password-verifier-service";

export class SuccessPasswordVerifierService implements PasswordVerifierService {
  public async verify(): Promise<boolean> {
    return true;
  }
}
