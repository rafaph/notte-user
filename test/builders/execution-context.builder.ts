import { ExecutionContext } from "@nestjs/common";

export class ExecutionContextBuilder {
  private request: { [key: string]: unknown };

  public constructor() {
    this.request = {
      headers: {
        authorization: "Bearer token",
      },
    };
  }

  public withHeaders(headers: {
    [key: string]: string;
  }): ExecutionContextBuilder {
    this.request = { headers };
    return this;
  }

  public build(): ExecutionContext {
    const { request } = this;

    return {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  }
}
