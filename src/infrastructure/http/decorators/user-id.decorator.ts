import { Param, ParseUUIDPipe } from "@nestjs/common";

export const UserId = () =>
  Param("userId", new ParseUUIDPipe({ version: "4" }));
