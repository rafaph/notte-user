import httpStatus from "http-status";

import { html } from "@/external/http/cero/api-docs/html";
import { CeroHandler } from "@/external/http/cero/interfaces/cero-handler";

/* istanbul ignore next */
export const serve: CeroHandler = async (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.writeHead(httpStatus.OK);
  res.end(html);
};
