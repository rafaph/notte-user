import { randomUUID } from "crypto";

import { faker } from "@faker-js/faker";

import { User, UserProps } from "@/user/domain/models";

export class UserBuilder {
  private readonly props: UserProps;

  public constructor() {
    this.props = {
      id: randomUUID(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  }

  public withFirstName(firstName: string): UserBuilder {
    this.props.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): UserBuilder {
    this.props.lastName = lastName;
    return this;
  }

  public withEmail(email: string): UserBuilder {
    this.props.email = email;
    return this;
  }

  public withPassword(password: string): UserBuilder {
    this.props.password = password;
    return this;
  }

  public build(): User {
    return new User(this.props);
  }
}
