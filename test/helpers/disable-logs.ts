import { Logger } from "@nestjs/common";
import { get } from "lodash";

export function disableLogs<T = object>(sut: T): void {
  const logger = get(sut, "logger") as unknown as Logger;

  jest.spyOn(logger, "log").mockReturnValue();
  jest.spyOn(logger, "error").mockReturnValue();
  jest.spyOn(logger, "debug").mockReturnValue();
  jest.spyOn(logger, "verbose").mockReturnValue();
  jest.spyOn(logger, "warn").mockReturnValue();
}
