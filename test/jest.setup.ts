import * as path from "path";

import * as dotenv from "dotenv";

const onContainer = process.env.ON_CONTAINER === "true";

if (!onContainer) {
  dotenv.config({
    path: path.join(__dirname, "..", "local.env"),
  });
}
