import { faker } from "@faker-js/faker";

import { VerifyTokenQuery } from "@/application/queries";

import { InterfaceOf } from "@test/helpers";

export class VerifyTokenQueryBuilder {
  private props: InterfaceOf<VerifyTokenQuery>;

  public constructor() {
    this.props = {
      token: `token_${faker.string.uuid()}`,
    };
  }

  public withToken(token: string): VerifyTokenQueryBuilder {
    this.props.token = token;

    return this;
  }

  public withPayload(payload: string): VerifyTokenQueryBuilder {
    this.props.token = `token_${payload}`;

    return this;
  }

  public build(): VerifyTokenQuery {
    return new VerifyTokenQuery(this.props.token);
  }
}
