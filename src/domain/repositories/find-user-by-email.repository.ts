import { User } from "@/domain/models";

export abstract class FindUserByEmailRepository {
  public abstract findByEmail(email: string): Promise<User | null>;
}
