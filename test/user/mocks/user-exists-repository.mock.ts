import { UserExistsRepository } from "@/user/domain/repositories";

export class UserExistsRepositoryMock implements UserExistsRepository {
  public async exists(): Promise<boolean> {
    return false;
  }
}
