import { Logger } from "@nestjs/common";
import { get, has } from "lodash";

export function disableLogs<T = object>(sut: T): void {
  if (has(sut, "logger")) {
    const logger = get(sut, "logger") as unknown as Logger;

    jest.spyOn(logger, "log").mockReturnValue();
    jest.spyOn(logger, "error").mockReturnValue();
    jest.spyOn(logger, "debug").mockReturnValue();
    jest.spyOn(logger, "verbose").mockReturnValue();
    jest.spyOn(logger, "warn").mockReturnValue();
  }
}
