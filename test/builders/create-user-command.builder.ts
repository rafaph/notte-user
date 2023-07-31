import { faker } from "@faker-js/faker";

import { CreateUserCommand } from "@/application/commands";
import { WritableUserProps } from "@/domain/models";

export class CreateUserCommandBuilder {
  private readonly props: WritableUserProps;

  public constructor() {
    this.props = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }

  public withFirstName(firstName: string): CreateUserCommandBuilder {
    this.props.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): CreateUserCommandBuilder {
    this.props.lastName = lastName;
    return this;
  }

  public withEmail(email: string): CreateUserCommandBuilder {
    this.props.email = email;
    return this;
  }

  public withPassword(password: string): CreateUserCommandBuilder {
    this.props.password = password;
    return this;
  }

  public build(): CreateUserCommand {
    return new CreateUserCommand(this.props);
  }
}
