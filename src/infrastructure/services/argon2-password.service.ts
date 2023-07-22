import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";

import { PasswordService } from "@/application/services";

@Injectable()
export class Argon2PasswordService implements PasswordService {
  public hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  public verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
