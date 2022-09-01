import { Request } from "@/infra/http/interfaces/request";
import { Response } from "@/infra/http/interfaces/response";

export interface Middleware {
  handle(request: Request): Promise<Response>;
}
