import { injectable } from "inversify";

import { ValidatorMiddleware } from "@/infra/http/middlewares/validator-middleware";
import { GetUserRequestSchema } from "@/infra/http/request-schemas/get-user-request-schema";

@injectable()
export class GetUserValidatorMiddleware extends ValidatorMiddleware {
  public constructor() {
    super(GetUserRequestSchema, "body");
  }
}
