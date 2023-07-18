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

import { EmailAlreadyInUseError } from "@/user/domain/errors";
import { CreateUserRequest } from "@/user/infrastructure/http/requests";

@Controller("user")
export class CreateUserController {
  private readonly logger = new Logger(CreateUserController.name);

  public constructor(private readonly commandBus: CommandBus) {}

  @Version("1")
  @Post()
  public async handle(@Body() request: CreateUserRequest): Promise<void> {
    const command = request.toCommand();
    this.logger.log(`command = ${JSON.stringify(command.userProps, null, 4)}`);
    try {
      await this.commandBus.execute(command);
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        throw new ConflictException(
          `Email "${request.email}" is already in use by another user, please use another.`,
        );
      }

      this.logger.error("Fail to create user", error);

      throw new InternalServerErrorException(
        "Fail to create your user, please try again later.",
      );
    }
  }
}
