import { Injectable, Logger } from "@nestjs/common";
import { SignJWT, importPKCS8, importSPKI, KeyLike, jwtVerify } from "jose";
import { None, Option, Some } from "oxide.ts";

import { TokenService } from "@/application/services";
import { AppConfig } from "@/config";

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly logger = new Logger(JwtTokenService.name);
  private privateKey!: KeyLike;
  private publicKey!: KeyLike;
  private readonly algorithm: string;
  private readonly expiresIn: string;
  private readonly issuer = "urn:notte";

  public constructor(private readonly config: AppConfig) {
    this.algorithm = this.config.jwt.algorithm;
    this.expiresIn = this.config.jwt.expiresIn;
  }

  private async getPrivateKey(): Promise<KeyLike> {
    if (!this.privateKey) {
      this.privateKey = await importPKCS8(
        this.config.jwt.privateKey.replaceAll("#", "\n"),
        this.algorithm,
      );
    }

    return this.privateKey;
  }

  private async getPublicKey(): Promise<KeyLike> {
    if (!this.publicKey) {
      this.publicKey = await importSPKI(
        this.config.jwt.publicKey.replaceAll("#", "\n"),
        this.algorithm,
      );
    }

    return this.publicKey;
  }

  public async sign(payload: string): Promise<string> {
    const privateKey = await this.getPrivateKey();

    return new SignJWT({ payload })
      .setProtectedHeader({ alg: this.algorithm })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setExpirationTime(this.expiresIn)
      .sign(privateKey);
  }

  public async verify(token: string): Promise<Option<string>> {
    const publicKey = await this.getPublicKey();
    try {
      const result = await jwtVerify(token, publicKey, {
        issuer: this.issuer,
      });
      const { payload } = result.payload;

      return Some(payload as string);
    } catch (error) {
      this.logger.error("Fail to verify token", error);
      return None;
    }
  }
}
