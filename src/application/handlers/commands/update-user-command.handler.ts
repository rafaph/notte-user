import { Logger } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { omit } from "lodash";

import { UpdateUserCommand } from "@/application/commands";
import { PasswordService } from "@/application/services";
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
    private readonly passwordService: PasswordService,
  ) {}

  private handleError(message: string, error: unknown): never {
    this.logger.error(message, error);

    throw new UserUpdateError();
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await this.passwordService.hash(password);
    } catch (error) {
      this.handleError("Fail to hash user password", error);
    }
  }

  private async findUserById(id: string): Promise<User | null> {
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

  private async canUpdateEmail(
    user: User,
    userProps: UpdateUserCommand["userProps"],
  ): Promise<boolean> {
    if (!userProps.email || user.email === userProps.email) {
      return true;
    }

    try {
      const user = await this.findUserByEmailRepository.findByEmail(
        userProps.email,
      );
      return user === null;
    } catch (error) {
      this.handleError("Fail to check if user email is already in use", error);
    }
  }

  public async execute({ userProps }: UpdateUserCommand): Promise<void> {
    const user = await this.findUserById(userProps.id);

    if (user === null) {
      throw new UserNotFoundError();
    }

    const canUpdateEmail = await this.canUpdateEmail(user, userProps);

    if (!canUpdateEmail) {
      throw new EmailAlreadyInUseError();
    }

    if (userProps.password) {
      userProps.password = await this.hashPassword(userProps.password);
    }

    user.update(omit(userProps, ["id"]));

    await this.updateUser(user);
  }
}
