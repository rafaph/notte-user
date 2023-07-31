import { DeleteUserRepository } from "@/domain/repositories";

export class DeleteUserRepositoryMock implements DeleteUserRepository {
  public async delete(): Promise<void> {}
}
