import { CeroRequest } from "@/external/http/cero/interfaces/cero-request";
import { CeroResponse } from "@/external/http/cero/interfaces/cero-response";
import { NextFunction } from "@/external/http/cero/interfaces/next-function";

export type CeroHandler = (
  ceroRequest: CeroRequest,
  ceroResponse: CeroResponse,
  next: NextFunction,
) => Promise<void>;
