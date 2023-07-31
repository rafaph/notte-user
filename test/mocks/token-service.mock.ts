import { None, Some, Option } from "oxide.ts";

import { TokenService } from "@/application/services";

export class TokenServiceMock implements TokenService {
  private readonly prefix = "token_";
  public async sign(payload: string): Promise<string> {
    return `${this.prefix}${payload}`;
  }

  public async verify(token: string): Promise<Option<string>> {
    if (!token.startsWith(this.prefix)) {
      return None;
    }

    return Some(token.substring(this.prefix.length));
  }
}
