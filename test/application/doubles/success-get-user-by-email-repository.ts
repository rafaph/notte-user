import { Option, Some } from "oxide.ts";

import { User } from "@/domain/entities/user";
import { GetUserByEmailRepository } from "@/domain/repositories/get-user-by-email-repository";

import { makeUser } from "@test/domain/factories/make-user";

export class SuccessGetUserByEmailRepository
  implements GetUserByEmailRepository
{
  public constructor(public readonly user: Option<User> = Some(makeUser())) {}

  public async getByEmail(): Promise<Option<User>> {
    return this.user;
  }
}
