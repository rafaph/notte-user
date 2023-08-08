import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  UnauthorizedException,
  Version,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { VerifyUserCommand } from "@/application/commands";
import { InvalidCredentialsError } from "@/domain/errors";
import { VerifyUserRequest } from "@/infrastructure/http/requests";

@Controller("user")
export class VerifyUserController {
  private readonly logger = new Logger(VerifyUserController.name);

  public constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.OK)
  @Version("1")
  @Post("verify")
  public async handle(@Body() request: VerifyUserRequest): Promise<void> {
    const command = request.toCommand();

    try {
      await this.commandBus.execute<VerifyUserCommand>(command);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException();
      }

      this.logger.error("Fail to verify an user", error);

      throw new InternalServerErrorException(
        "Fail to verify your user, please try again later.",
      );
    }
  }
}
