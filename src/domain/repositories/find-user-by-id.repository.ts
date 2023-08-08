import { User } from "@/domain/models";

export abstract class FindUserByIdRepository {
  public abstract findById(id: string): Promise<User | null>;
}
