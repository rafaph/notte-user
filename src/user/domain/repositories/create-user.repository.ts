import { User } from "@/user/domain/models/user";

export abstract class CreateUserRepository {
  public abstract create(user: User): Promise<void>;
}
