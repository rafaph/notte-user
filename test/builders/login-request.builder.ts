import { faker } from "@faker-js/faker";

import { LoginRequest } from "@/infrastructure/http/requests";

export type Request = Omit<LoginRequest, "toQuery">;

export class LoginRequestBuilder {
  private readonly props: Request;

  public constructor() {
    this.props = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }

  public withEmail(email: string): LoginRequestBuilder {
    this.props.email = email;
    return this;
  }

  public withPassword(password: string): LoginRequestBuilder {
    this.props.password = password;
    return this;
  }

  public build(): Request {
    return this.props;
  }
}
