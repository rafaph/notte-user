import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";

import { PasswordService } from "@/application/services";
import { AppConfig } from "@/config";

@Injectable()
export class Argon2PasswordService implements PasswordService {
  private readonly secret: Buffer;

  public constructor(config: AppConfig) {
    this.secret = Buffer.from(config.argon2.secret);
  }

  public hash(password: string): Promise<string> {
    return argon2.hash(password, { secret: this.secret });
  }

  public verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password, { secret: this.secret });
  }
}
