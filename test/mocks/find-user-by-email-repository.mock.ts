import { User } from "@/domain/models";
import { FindUserByEmailRepository } from "@/domain/repositories";

export class FindUserByEmailRepositoryMock
  implements FindUserByEmailRepository
{
  public constructor(private readonly returnedUser: User | null = null) {}

  public async findByEmail(): Promise<User | null> {
    return this.returnedUser;
  }
}
