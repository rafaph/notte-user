/* eslint @typescript-eslint/no-empty-function: "off" */
import { injectable } from "inversify";

import { Request } from "@/infra/http/interfaces/request";
import { Response } from "@/infra/http/interfaces/response";

@injectable()
export abstract class Controller {
  public onStart(): Promise<void> | void {}
  public onEnd(): Promise<void> | void {}
  public abstract handle(request: Request): Promise<Response>;
}
