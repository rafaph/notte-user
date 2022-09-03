import cero, { CeroRouter, CeroServer as HTTPServer } from "0http";
import bodyParser from "body-parser";
import cors from "cors";
import httpStatus from "http-status";
import { Container, inject, injectable } from "inversify";
import low from "low-http-server";

import { Config } from "@/config/config";
import * as apiDocs from "@/external/http/cero/api-docs";
import { CeroHandler } from "@/external/http/cero/interfaces/cero-handler";
import { CeroRequest } from "@/external/http/cero/interfaces/cero-request";
import { CeroResponse } from "@/external/http/cero/interfaces/cero-response";
import { Controller } from "@/infra/http/interfaces/controller";
import { Middleware } from "@/infra/http/interfaces/middleware";
import { Request } from "@/infra/http/interfaces/request";
import { Response } from "@/infra/http/interfaces/response";
import { BaseServer, Server } from "@/infra/http/interfaces/server";
import { Logger } from "@/lib/logger";

@injectable()
export class CeroServer extends BaseServer implements Server {
  private readonly server: HTTPServer;
  private readonly router: CeroRouter;
  private listening = false;

  public constructor(@inject(Container) container: Container) {
    super(container);

    const { server, router } = cero({
      server: low(),
    });

    this.server = server;
    this.router = router;

    this.configureRoutes();
  }

  protected createRequest(ceroRequest: CeroRequest): Request {
    return {
      headers: ceroRequest.headers,
      body: ceroRequest.body,
      params: ceroRequest.params,
      query: ceroRequest.query,
    };
  }

  protected send(ceroResponse: CeroResponse, response: Response): void {
    for (const [header, value] of Object.entries(response.headers ?? {})) {
      ceroResponse.setHeader(header, value);
    }
    ceroResponse.setHeader("Content-Type", "application/json");
    ceroResponse.writeHead(response.status);
    ceroResponse.end(response.body ? JSON.stringify(response.body) : undefined);
  }

  private adaptMiddlewares(middlewares: Middleware[]): CeroHandler[] {
    return middlewares.map(
      (middleware) => async (ceroRequest, ceroResponse, next) => {
        const request = this.createRequest(ceroRequest);
        const response = await middleware.handle(request);

        if (response.status !== httpStatus.OK) {
          this.send(ceroResponse, response);
        } else {
          Object.assign(ceroRequest.body as object, response.body ?? {});
          Object.assign(ceroRequest.headers, response.headers ?? {});
          next();
        }
      },
    );
  }

  private adaptController(controller: Controller): CeroHandler {
    return async (ceroRequest, ceroResponse) => {
      const request = this.createRequest(ceroRequest);
      const onStart = controller.onStart();
      if (onStart instanceof Promise) {
        await onStart;
      }
      const response = await controller.handle(request);
      const onEnd = controller.onEnd();
      if (onEnd instanceof Promise) {
        await onEnd;
      }

      this.send(ceroResponse, response);
    };
  }

  private configureRoutes(): void {
    this.router.use("/", cors({ optionsSuccessStatus: 200 }));
    this.router.get("/api-docs", apiDocs.serve);
    this.router.get("/api-docs/docs.json", apiDocs.serveDocs);
    this.router.use("/api-docs/static/:file", apiDocs.serveStatic);
    this.router.use("/", bodyParser.json());

    for (const route of this.routes) {
      this.router.add(
        route.method,
        route.path,
        ...this.adaptMiddlewares(route.middlewares),
        this.adaptController(route.controller),
      );
    }
  }

  public listen(): Promise<void> {
    const config = this.container.get(Config);
    const host = config.host;
    const port = config.port;
    const address = `http://${host}:${port}`;

    return new Promise((resolve, reject) => {
      this.server.listen(host, port, (socket) => {
        if (socket) {
          Logger.info(`Server is now listening on ${address}`);
          this.listening = true;
          resolve();
        } else {
          this.listening = false;
          Logger.error("Fail to start server...");
          reject();
        }
      });
    });
  }

  public close(): void {
    if (this.listening) {
      this.server.close();
      this.listening = false;
    }
  }
}
