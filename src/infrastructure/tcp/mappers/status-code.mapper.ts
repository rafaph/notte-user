import { HttpStatus } from "@nestjs/common";

const StatusToStatusCodeArray = Object.entries(HttpStatus).filter((value) =>
  /^[A-Z_]+$/.test(value[0]),
) as Array<[string, number]>;

const StatusCodeToStatusMap = Object.fromEntries(
  StatusToStatusCodeArray.map(([key, value]) => [value, key]),
);

const StatusToStatusCodeMap = Object.fromEntries(StatusToStatusCodeArray);

export function toString(statusCode: number): string {
  return StatusCodeToStatusMap[statusCode];
}

export function toStatusCode(status: string): number {
  return StatusToStatusCodeMap[status];
}
