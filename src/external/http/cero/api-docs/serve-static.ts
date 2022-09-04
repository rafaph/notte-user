import fs from "fs";
import path from "path";

import httpStatus from "http-status";
import { absolutePath } from "swagger-ui-dist";

import { CeroHandler } from "@/external/http/cero/interfaces/cero-handler";

const distPath = absolutePath();

interface WhiteFileMap {
  [key: string]: {
    content: string | Buffer;
    contentType: string;
  };
}

const whiteFileMap: WhiteFileMap = {
  "swagger-ui.css": {
    content: fs.readFileSync(path.join(distPath, "swagger-ui.css"), {
      encoding: "utf-8",
    }),
    contentType: "text/css",
  },
  "swagger-ui.css.map": {
    content: fs.readFileSync(path.join(distPath, "swagger-ui.css.map"), {
      encoding: "utf-8",
    }),
    contentType: "text/plain",
  },
  "index.css": {
    content: fs.readFileSync(path.join(distPath, "index.css"), {
      encoding: "utf-8",
    }),
    contentType: "text/css",
  },
  "favicon-32x32.png": {
    content: fs.readFileSync(path.join(distPath, "favicon-32x32.png"), {
      encoding: "binary",
    }),
    contentType: "image/png",
  },
  "favicon-16x16.png": {
    content: fs.readFileSync(path.join(distPath, "favicon-16x16.png"), {
      encoding: "binary",
    }),
    contentType: "image/png",
  },
  "swagger-ui-bundle.js": {
    content: fs.readFileSync(path.join(distPath, "swagger-ui-bundle.js"), {
      encoding: "utf-8",
    }),
    contentType: "application/javascript",
  },
  "swagger-ui-bundle.js.map": {
    content: fs.readFileSync(path.join(distPath, "swagger-ui-bundle.js.map"), {
      encoding: "utf-8",
    }),
    contentType: "text/plain",
  },
  "swagger-ui-standalone-preset.js": {
    content: fs.readFileSync(
      path.join(distPath, "swagger-ui-standalone-preset.js"),
      { encoding: "utf-8" },
    ),
    contentType: "application/javascript",
  },
  "swagger-ui-standalone-preset.js.map": {
    content: fs.readFileSync(
      path.join(distPath, "swagger-ui-standalone-preset.js.map"),
      { encoding: "utf-8" },
    ),
    contentType: "text/plain",
  },
};

/* istanbul ignore next */
export const serveStatic: CeroHandler = async (req, res) => {
  const { file } = req.params;
  const fileData = whiteFileMap[file];

  if (!fileData) {
    res.writeHead(httpStatus.NOT_FOUND);
    res.end();
    return;
  }

  const { content, contentType } = fileData;

  res.setHeader("Content-Type", contentType);
  res.writeHead(httpStatus.OK);
  res.end(content);
};
