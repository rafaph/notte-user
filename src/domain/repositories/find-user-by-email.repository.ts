import { Option } from "oxide.ts";

import { User } from "@/domain/models";

export abstract class FindUserByEmailRepository {
  public abstract findByEmail(email: string): Promise<Option<User>>;
}
