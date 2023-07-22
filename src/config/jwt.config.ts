import { IsNotEmpty } from "class-validator";

export class JwtConfig {
  @IsNotEmpty()
  public readonly expiresIn!: string;

  @IsNotEmpty()
  public readonly algorithm!: string;

  @IsNotEmpty()
  public readonly publicKey!: string;

  @IsNotEmpty()
  public readonly privateKey!: string;
}
