import { None, Option } from "oxide.ts";

import { User } from "@/domain/models";
import { FindUserByEmailRepository } from "@/domain/repositories";

export class FindUserByEmailRepositoryMock
  implements FindUserByEmailRepository
{
  public async findByEmail(): Promise<Option<User>> {
    return None;
  }
}
