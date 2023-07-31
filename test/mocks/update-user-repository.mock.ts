import { UpdateUserRepository } from "@/domain/repositories";

export class UpdateUserRepositoryMock implements UpdateUserRepository {
  public async update(): Promise<void> {}
}
