import { Logger } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Option } from "oxide.ts";

import { VerifyUserCommand } from "@/application/commands";
import { PasswordService } from "@/application/services";
import {
  InvalidCredentialsError,
  UserVerificationError,
} from "@/domain/errors";
import { User } from "@/domain/models";
import { FindUserByEmailRepository } from "@/domain/repositories";

@CommandHandler(VerifyUserCommand)
export class VerifyUserCommandHandler
  implements ICommandHandler<VerifyUserCommand>
{
  private readonly logger = new Logger(VerifyUserCommandHandler.name);

  public constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly passwordService: PasswordService,
  ) {}

  private handleError(message: string, error: unknown): never {
    this.logger.error(message, error);

    throw new UserVerificationError();
  }

  private async getUser(email: string): Promise<Option<User>> {
    try {
      return await this.findUserByEmailRepository.findByEmail(email);
    } catch (error) {
      this.handleError(
        "Fail to get credentials on get credentials repository",
        error,
      );
    }
  }

  private async verifyPassword(
    hash: string,
    password: string,
  ): Promise<boolean> {
    try {
      return await this.passwordService.verify(hash, password);
    } catch (error) {
      this.handleError("Fail to verify hash and password", error);
    }
  }

  public async execute({ email, password }: VerifyUserCommand): Promise<void> {
    const userOption = await this.getUser(email);

    if (userOption.isNone()) {
      throw new InvalidCredentialsError();
    }

    const user = userOption.unwrap();
    const isPasswordCorrect = await this.verifyPassword(
      user.password,
      password,
    );

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError();
    }
  }
}
