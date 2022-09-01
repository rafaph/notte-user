import { spawn } from "child_process";
import path from "path";

import { retry } from "async";
import axios from "axios";
import { getPort } from "get-port-please";
import httpStatus from "http-status";

export class TestServer {
  private port?: number;
  private pid?: number;

  public constructor(public readonly env: NodeJS.ProcessEnv) {}

  private start(): void {
    const childProcess = spawn("npm", ["run", "start:dev:test"], {
      env: {
        ...process.env,
        ...this.env,
        PORT: this.port?.toString(10),
      },
      cwd: path.join(__dirname, "..", ".."),
      detached: true,
      killSignal: "SIGTERM",
      stdio: "inherit",
    });

    if (typeof childProcess.pid === "undefined") {
      throw new Error("Server process not started.");
    }

    this.pid = childProcess.pid;
  }

  public get address(): string {
    const port = this.port ?? -1;

    return `http://localhost:${port}`;
  }

  private getStatus(): Promise<number> {
    const statusUrl = `${this.address}/status`;
    return axios
      .get(statusUrl)
      .then(({ status }) => status)
      .catch(() => httpStatus.NOT_FOUND);
  }

  private async awaitStatus(compare: (status: number) => void): Promise<void> {
    await retry({ times: 100, interval: 100 }, async () => {
      const status = await this.getStatus();
      compare(status);
    });
  }

  public async up() {
    this.port = await getPort();
    this.start();
    await this.awaitStatus((status) => {
      if (status !== httpStatus.OK) {
        throw new Error("Server is not available yet.");
      }
    });
  }

  public async down() {
    if (this.pid !== undefined) {
      process.kill(-this.pid);
      await this.awaitStatus((status) => {
        if (status === httpStatus.OK) {
          throw new Error("Server is still available.");
        }
      });
      this.pid = undefined;
    }
  }
}
