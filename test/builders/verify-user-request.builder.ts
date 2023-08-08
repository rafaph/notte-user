import { faker } from "@faker-js/faker";

import { VerifyUserRequest } from "@/infrastructure/http/requests";

export type Request = Omit<VerifyUserRequest, "toCommand">;

export class VerifyUserRequestBuilder {
  private readonly props: Request;

  public constructor() {
    this.props = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }

  public withEmail(email: string): VerifyUserRequestBuilder {
    this.props.email = email;
    return this;
  }

  public withPassword(password: string): VerifyUserRequestBuilder {
    this.props.password = password;
    return this;
  }

  public build(): Request {
    return this.props;
  }
}
