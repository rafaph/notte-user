import { faker } from "@faker-js/faker";

import { UpdateUserCommand } from "@/application/commands";

export class UpdateUserCommandBuilder {
  private readonly props: UpdateUserCommand["userProps"];

  public constructor() {
    this.props = {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }

  public withId(id: string): UpdateUserCommandBuilder {
    this.props.id = id;
    return this;
  }

  public withFirstName(firstName: string): UpdateUserCommandBuilder {
    this.props.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): UpdateUserCommandBuilder {
    this.props.lastName = lastName;
    return this;
  }

  public withEmail(email: string): UpdateUserCommandBuilder {
    this.props.email = email;
    return this;
  }

  public withPassword(password: string): UpdateUserCommandBuilder {
    this.props.password = password;
    return this;
  }

  public build(): UpdateUserCommand {
    return new UpdateUserCommand(this.props);
  }
}
