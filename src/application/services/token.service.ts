import { Option } from "oxide.ts";

export abstract class TokenService {
  public abstract sign(payload: string): Promise<string>;
  public abstract verify(token: string): Promise<Option<string>>;
}
