import {
  BAD_REQUEST,
  CREATED,
  UNPROCESSABLE_ENTITY,
  OK,
  NOT_FOUND,
} from "http-status";

export abstract class Response<Body = unknown> {
  public headers?: Record<string, string>;
  public body?: Body;
  public status!: number;

  public static created<Body = unknown>(body?: Body): Response<Body> {
    return {
      status: CREATED,
      body,
    };
  }

  public static unprocessableEntity<Body = unknown>(
    body?: Body,
  ): Response<Body> {
    return {
      status: UNPROCESSABLE_ENTITY,
      body,
    };
  }

  public static badRequest<Body = unknown>(body?: Body): Response<Body> {
    return {
      status: BAD_REQUEST,
      body,
    };
  }

  public static ok<Body = unknown>(body?: Body): Response<Body> {
    return {
      status: OK,
      body,
    };
  }

  public static notFound<Body = unknown>(body?: Body): Response<Body> {
    return {
      status: NOT_FOUND,
      body,
    };
  }
}
