import { None, Option } from "oxide.ts";

import { User } from "@/domain/models";
import { FindUserByIdRepository } from "@/domain/repositories";

export class FindUserByIdRepositoryMock implements FindUserByIdRepository {
  public constructor(private readonly returnedUser: Option<User> = None) {}

  public async findById(): Promise<Option<User>> {
    return this.returnedUser;
  }
}
