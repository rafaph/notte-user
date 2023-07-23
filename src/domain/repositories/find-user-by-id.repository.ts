import { Option } from "oxide.ts";

import { User } from "@/domain/models";

export abstract class FindUserByIdRepository {
  public abstract findById(id: string): Promise<Option<User>>;
}
