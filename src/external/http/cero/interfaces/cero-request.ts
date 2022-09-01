export interface CeroRequest {
  body: unknown;
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  headers: Record<string, string | string[]>;
  query: Record<string, string | string[]>;
  path: string;
  params: Record<string, string>;
}
