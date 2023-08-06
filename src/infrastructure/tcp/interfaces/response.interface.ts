export interface Response<T = unknown> {
  status: string;
  data?: T;
  timestamp: string;
}
