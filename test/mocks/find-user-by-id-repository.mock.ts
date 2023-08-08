import { User } from "@/domain/models";
import { FindUserByIdRepository } from "@/domain/repositories";

export class FindUserByIdRepositoryMock implements FindUserByIdRepository {
  public constructor(private readonly returnedUser: User | null = null) {}

  public async findById(): Promise<User | null> {
    return this.returnedUser;
  }
}
