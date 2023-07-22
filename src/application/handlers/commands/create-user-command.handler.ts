import { Logger } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { CreateUserCommand } from "@/application/commands";
import { PasswordService } from "@/application/services";
import { EmailAlreadyInUseError, UserCreationError } from "@/domain/errors";
import { User, WritableUserProps } from "@/domain/models";
import {
  CreateUserRepository,
  FindUserByEmailRepository,
} from "@/domain/repositories";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  private readonly logger = new Logger(CreateUserCommandHandler.name);

  public constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly createUserRepository: CreateUserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  private async checkEmailInUse(email: string): Promise<boolean> {
    try {
      const userOption = await this.findUserByEmailRepository.findByEmail(
        email,
      );
      return userOption.isSome();
    } catch (error) {
      this.logger.error("Fail to check if user email is already in use", error);
      throw new UserCreationError();
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await this.passwordService.hash(password);
    } catch (error) {
      this.logger.error("Fail to hash user password", error);
      throw new UserCreationError();
    }
  }

  private async createUser(userProps: WritableUserProps): Promise<void> {
    const user = User.new({
      ...userProps,
      password: await this.hashPassword(userProps.password),
    });

    try {
      return await this.createUserRepository.create(user);
    } catch (error) {
      this.logger.error("Fail to create user on repository", error);
      throw new UserCreationError();
    }
  }

  public async execute(command: CreateUserCommand): Promise<void> {
    const { userProps } = command;
    const inUse = await this.checkEmailInUse(userProps.email);

    if (inUse) {
      throw new EmailAlreadyInUseError();
    }

    await this.createUser(userProps);
  }
}
