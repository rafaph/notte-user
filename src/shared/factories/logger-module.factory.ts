import { Params } from "nestjs-pino";

import { AppConfig } from "@/shared/config";

function mapLogLevel(logLevel: string): string {
  switch (logLevel) {
    case "verbose":
      return "trace";
    case "log":
      return "info";
    case "fatal":
      return "error";
  }

  return logLevel;
}

export function loggerModuleFactory(
  config: AppConfig,
): Params | Promise<Params> {
  const params: Params = {
    pinoHttp: {
      level: mapLogLevel(config.logLevel),
    },
  };

  if (config.env !== "production") {
    params.pinoHttp = {
      ...params.pinoHttp,
      transport: {
        target: "pino-pretty",
      },
    };
  }

  return params;
}
