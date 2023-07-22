import { Option } from "oxide.ts";

import { Credentials } from "@/domain/models";

export abstract class GetCredentialsRepository {
  public abstract get(email: string): Promise<Option<Credentials>>;
}
