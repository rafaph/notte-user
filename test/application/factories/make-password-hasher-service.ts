import sinon from "sinon";

import { PasswordHasherService } from "@/domain/services/password-hasher-service";

export const makePasswordHasherService = (
  returned: Promise<string> = Promise.resolve("hashed-password"),
): PasswordHasherService => ({
  hash: sinon.stub().returns(returned),
});
