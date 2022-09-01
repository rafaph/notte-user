import { User } from "@/domain/entities/user";

export abstract class CreateUserRepository {
  public abstract create(user: User): Promise<void>;
}
