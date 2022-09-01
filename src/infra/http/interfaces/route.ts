import { Controller } from "@/infra/http/interfaces/controller";
import { Middleware } from "@/infra/http/interfaces/middleware";
import { Newable } from "@/lib/ts";

export interface Route {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  middlewares?: Newable<Middleware>[];
  controller: Newable<Controller>;
}
