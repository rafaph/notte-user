import * as argon2 from "argon2";
import { injectable } from "inversify";

import { PasswordHasherService } from "@/domain/services/password-hasher-service";
import { PasswordVerifierService } from "@/domain/services/password-verifier-service";

@injectable()
export class Argon2PasswordService
  implements PasswordHasherService, PasswordVerifierService
{
  public hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  public async verify(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}
