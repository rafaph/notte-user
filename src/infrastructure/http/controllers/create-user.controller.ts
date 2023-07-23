import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Version,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { CreateUserCommand } from "@/application/commands";
import { EmailAlreadyInUseError } from "@/domain/errors";
import { CreateUserRequest } from "@/infrastructure/http/requests";

@Controller("user")
export class CreateUserController {
  private readonly logger = new Logger(CreateUserController.name);

  public constructor(private readonly commandBus: CommandBus) {}

  @Version("1")
  @Post()
  public async handle(@Body() request: CreateUserRequest): Promise<void> {
    const command = request.toCommand();

    try {
      await this.commandBus.execute<CreateUserCommand>(command);
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        throw new ConflictException(
          `Email "${request.email}" is already in use by another user.`,
        );
      }

      this.logger.error("Fail to create user", error);

      throw new InternalServerErrorException(
        "Fail to create your user, please try again later.",
      );
    }
  }
}
