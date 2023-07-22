import { TokenService } from "@/application/services";

export class JwtTokenService implements TokenService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public sign(_payload: string): Promise<string> {
    return Promise.resolve("");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public verify(_token: string): Promise<string> {
    return Promise.resolve("");
  }
}
