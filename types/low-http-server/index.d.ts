declare module "low-http-server" {
  import { Server } from "http";

  function low(): Server;

  export default low;
}
