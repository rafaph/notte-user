import { User } from "@/domain/models";

export abstract class CreateUserRepository {
  public abstract create(user: User): Promise<void>;
}
