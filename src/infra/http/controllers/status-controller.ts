import { injectable } from "inversify";

import { Controller } from "@/infra/http/interfaces/controller";
import { Response } from "@/infra/http/interfaces/response";

@injectable()
export class StatusController extends Controller {
  public async handle(): Promise<Response> {
    return Response.ok({
      status: "OK",
    });
  }
}
