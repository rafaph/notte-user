import { CreateUserRepository } from "@/domain/repositories/create-user-repository";

export class SuccessCreateUserRepository implements CreateUserRepository {
  public create(): Promise<void> {
    return Promise.resolve();
  }
}
