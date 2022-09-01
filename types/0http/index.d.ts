declare module "0http" {
  import { Server } from "http";

  import Trouter from "trouter";

  export interface CeroConfig {
    server?: Server;
  }

  export type CeroRouter = Trouter;

  export interface CeroServer {
    close(): void;
    listen(host: string, port: number, cb: (socket: unknown) => void): void;
  }

  let cero: (config?: CeroConfig) => {
    router: CeroRouter;
    server: CeroServer;
  };

  export default cero;
}
