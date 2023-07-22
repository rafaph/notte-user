import { faker } from "@faker-js/faker";

import { CreateUserRequest } from "@/infrastructure/http/requests";

export type Request = Omit<CreateUserRequest, "toCommand">;

export class CreateUserRequestBuilder {
  private readonly props: Request;

  public constructor() {
    const password = faker.internet.password({
      prefix: "@c6$A1!",
    });
    this.props = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      passwordConfirmation: password,
      password,
    };
  }

  public withFirstName(firstName: string): CreateUserRequestBuilder {
    this.props.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): CreateUserRequestBuilder {
    this.props.lastName = lastName;
    return this;
  }

  public withEmail(email: string): CreateUserRequestBuilder {
    this.props.email = email;
    return this;
  }

  public withPassword(password: string): CreateUserRequestBuilder {
    this.props.password = password;
    return this;
  }

  public withPasswordConfirmation(
    passwordConfirmation: string,
  ): CreateUserRequestBuilder {
    this.props.passwordConfirmation = passwordConfirmation;
    return this;
  }

  public build(): Request {
    return this.props;
  }
}
