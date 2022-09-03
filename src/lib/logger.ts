import { pino } from "pino";

export const Logger = pino({
  enabled: process.env.NODE_ENV !== "test",
});
