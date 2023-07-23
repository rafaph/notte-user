import { Logger } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Option } from "oxide.ts";

import { UpdateUserCommand } from "@/application/commands";
import {
  EmailAlreadyInUseError,
  UserNotFoundError,
  UserUpdateError,
} from "@/domain/errors";
import { User } from "@/domain/models";
import {
  FindUserByEmailRepository,
  FindUserByIdRepository,
  UpdateUserRepository,
} from "@/domain/repositories";

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  private readonly logger = new Logger(UpdateUserCommandHandler.name);

  public constructor(
    private readonly findUserByIdRepository: FindUserByIdRepository,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly updateUserRepository: UpdateUserRepository,
  ) {}

  private handleError(message: string, error: unknown): never {
    this.logger.error(message, error);

    throw new UserUpdateError();
  }

  private async findUserById(id: string): Promise<Option<User>> {
    try {
      return await this.findUserByIdRepository.findById(id);
    } catch (error) {
      this.handleError("Fail to find user by id.", error);
    }
  }

  private async updateUser(user: User): Promise<void> {
    try {
      await this.updateUserRepository.update(user);
    } catch (error) {
      this.handleError("Fail to update user", error);
    }
  }

  private async canUpdate(
    user: User,
    userProps: UpdateUserCommand["userProps"],
  ): Promise<boolean> {
    if (user.email === userProps.email) {
      return true;
    }

    try {
      const userOption = await this.findUserByEmailRepository.findByEmail(
        userProps.email,
      );
      return userOption.isNone();
    } catch (error) {
      this.handleError("Fail to check if user email is already in use", error);
    }
  }

  public async execute({ userProps }: UpdateUserCommand): Promise<void> {
    const userOption = await this.findUserById(userProps.id);

    if (userOption.isNone()) {
      throw new UserNotFoundError();
    }

    const user = userOption.unwrap();
    const canUpdate = await this.canUpdate(user, userProps);

    if (!canUpdate) {
      throw new EmailAlreadyInUseError();
    }

    user.update(userProps);
    await this.updateUser(user);
  }
}
