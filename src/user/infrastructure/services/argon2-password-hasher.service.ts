import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";

import { PasswordHasherService } from "@/user/application/services";

@Injectable()
export class Argon2PasswordHasherService implements PasswordHasherService {
  public hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  public verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
