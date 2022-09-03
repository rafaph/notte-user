import { injectable, unmanaged } from "inversify";

import { Middleware } from "@/infra/http/interfaces/middleware";
import { Request } from "@/infra/http/interfaces/request";
import { Response } from "@/infra/http/interfaces/response";
import { ValidatorType, safeParse } from "@/lib/validator";

@injectable()
export class ValidatorMiddleware implements Middleware {
  public constructor(
    @unmanaged()
    private readonly schema: ValidatorType,
    @unmanaged()
    private readonly requestKey: keyof Request,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const result = safeParse(this.schema, request[this.requestKey]);

    if (!result.success) {
      return Response.badRequest(result.error.detail);
    }

    return Response.ok(result.data);
  }
}
