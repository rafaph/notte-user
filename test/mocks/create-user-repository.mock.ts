import { CreateUserRepository } from "@/domain/repositories";

export class CreateUserRepositoryMock implements CreateUserRepository {
  public async create(): Promise<void> {}
}
