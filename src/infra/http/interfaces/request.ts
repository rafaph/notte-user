export interface Request<Body = unknown> {
  headers: Record<string, string | string[]>;
  body: Body;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
}
