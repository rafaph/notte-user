import sinon from "sinon";

import { CreateUserRepository } from "@/domain/repositories/create-user-repository";

export const makeCreateUserRepository = (
  returned = Promise.resolve(),
): CreateUserRepository => ({
  create: sinon.stub().returns(returned),
});
