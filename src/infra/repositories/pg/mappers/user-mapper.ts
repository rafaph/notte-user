import { User, UserProps } from "@/domain/entities/user";

export type UserDb = UserProps;

export class UserMapper {
  public static toDb(user: User): UserDb {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public static toUser(userDb: UserDb): User {
    const result = User.create({
      id: userDb.id,
      email: userDb.email,
      password: userDb.password,
      createdAt: userDb.createdAt,
      updatedAt: userDb.updatedAt,
    });

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    return result.unwrap();
  }
}
