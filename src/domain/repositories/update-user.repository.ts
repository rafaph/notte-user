import { User } from "@/domain/models";

export abstract class UpdateUserRepository {
  public abstract update(user: User): Promise<void>;
}
