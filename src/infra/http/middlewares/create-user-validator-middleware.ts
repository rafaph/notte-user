import { injectable } from "inversify";

import { ValidatorMiddleware } from "@/infra/http/middlewares/validator-middleware";
import { CreateUserRequestSchema } from "@/infra/http/request-schemas/create-user-request-schema";

@injectable()
export class CreateUserValidatorMiddleware extends ValidatorMiddleware {
  public constructor() {
    super(CreateUserRequestSchema, "body");
  }
}
