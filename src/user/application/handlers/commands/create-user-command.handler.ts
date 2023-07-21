import { Logger } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { PasswordService } from "@/shared/application/services";
import { CreateUserCommand } from "@/user/application/commands";
import {
  EmailAlreadyInUseError,
  UserCreationError,
} from "@/user/domain/errors";
import { User, WritableUserProps } from "@/user/domain/models";
import {
  CreateUserRepository,
  UserExistsRepository,
} from "@/user/domain/repositories";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  private readonly logger = new Logger(CreateUserCommandHandler.name);

  public constructor(
    private readonly userExistsRepository: UserExistsRepository,
    private readonly createUserRepository: CreateUserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  private async checkEmailInUse(email: string): Promise<boolean> {
    try {
      return await this.userExistsRepository.exists(email);
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
    const userExists = await this.checkEmailInUse(userProps.email);

    if (userExists) {
      throw new EmailAlreadyInUseError();
    }

    await this.createUser(userProps);
  }
}
