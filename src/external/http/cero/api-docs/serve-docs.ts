import httpStatus from "http-status";

import { docs } from "@/external/http/cero/api-docs/docs";
import { CeroHandler } from "@/external/http/cero/interfaces/cero-handler";

const docsJson = JSON.stringify(docs);

/* istanbul ignore next */
export const serveDocs: CeroHandler = async (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(httpStatus.OK);
  res.end(docsJson);
};
