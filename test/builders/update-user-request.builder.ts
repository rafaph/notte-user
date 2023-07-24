import { faker } from "@faker-js/faker";
import { omitBy } from "lodash";

import { UpdateUserRequest } from "@/infrastructure/http/requests";

export type Request = Omit<UpdateUserRequest, "toCommand">;

export class UpdateUserRequestBuilder {
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

  public withFirstName(firstName?: string): UpdateUserRequestBuilder {
    this.props.firstName = firstName;
    return this;
  }

  public withLastName(lastName?: string): UpdateUserRequestBuilder {
    this.props.lastName = lastName;
    return this;
  }

  public withEmail(email?: string): UpdateUserRequestBuilder {
    this.props.email = email;
    return this;
  }

  public withPassword(password?: string): UpdateUserRequestBuilder {
    this.props.password = password;
    return this;
  }

  public withPasswordConfirmation(
    passwordConfirmation?: string,
  ): UpdateUserRequestBuilder {
    this.props.passwordConfirmation = passwordConfirmation;
    return this;
  }

  public build(): Request {
    return omitBy(
      this.props,
      (value) => typeof value === "undefined" || value === null,
    );
  }
}
