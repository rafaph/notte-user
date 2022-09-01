import { None, Option } from "oxide.ts";
import sinon from "sinon";

import { User } from "@/domain/entities/user";
import { GetUserByEmailRepository } from "@/domain/repositories/get-user-by-email-repository";

export const makeGetUserByEmailRepository = (
  returned: Promise<Option<User>> = Promise.resolve(None),
): GetUserByEmailRepository => ({
  getByEmail: sinon.stub().returns(returned),
});
