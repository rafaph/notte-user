import { IsNotEmpty } from "class-validator";

export class Argon2Config {
  @IsNotEmpty()
  public readonly secret!: string;
}
