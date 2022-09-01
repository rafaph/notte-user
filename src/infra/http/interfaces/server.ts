import { Container, injectable, unmanaged } from "inversify";

import { Controller } from "@/infra/http/interfaces/controller";
import { Middleware } from "@/infra/http/interfaces/middleware";
import { Route } from "@/infra/http/interfaces/route";
import { routes } from "@/infra/http/routes";
import { Newable } from "@/lib/ts";

export abstract class Server {
  public abstract listen(): Promise<void>;
  public abstract close(): void;
}

interface SolvedRoute extends Omit<Route, "middlewares" | "controller"> {
  middlewares: Middleware[];
  controller: Controller;
}

@injectable()
export class BaseServer {
  public constructor(@unmanaged() protected readonly container: Container) {}

  protected get routes(): SolvedRoute[] {
    return routes.map((route) => ({
      ...route,
      middlewares: this.solveMiddlewares(route.middlewares),
      controller: this.solveController(route.controller),
    }));
  }

  private solveMiddlewares(middlewares?: Newable<Middleware>[]): Middleware[] {
    return middlewares
      ? middlewares.map((middlewareConstructor) =>
          this.container.get<Middleware>(middlewareConstructor),
        )
      : [];
  }

  private solveController(controller: Newable<Controller>): Controller {
    return this.container.get<Controller>(controller);
  }
}
