import "reflect-metadata";
import { Pool } from "pg";

import { Server } from "@/infra/http/interfaces/server";
import { makeContainer } from "@/ioc/make-container";
import { Logger } from "@/lib/logger";

const container = makeContainer();
const server = container.get<Server>(Server);
void server.listen();

const exitHandler = () => {
  Logger.info("Shutting down...");

  server.close();
  const pool = container.get<Pool>(Pool);
  if (pool.totalCount > 0) {
    void pool.end();
  }
};

process.on("SIGINT", exitHandler);
process.on("SIGTERM", exitHandler);
