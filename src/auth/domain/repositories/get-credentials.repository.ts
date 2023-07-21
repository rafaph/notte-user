import { Option } from "oxide.ts";

import { Credentials } from "@/auth/domain/model";

export abstract class GetCredentialsRepository {
  public abstract get(email: string): Promise<Option<Credentials>>;
}
