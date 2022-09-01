import { Option } from "oxide.ts";

import { User } from "@/domain/entities/user";

export abstract class GetUserByEmailRepository {
  public abstract getByEmail(email: string): Promise<Option<User>>;
}
