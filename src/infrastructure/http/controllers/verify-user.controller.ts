import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  Version,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { VerifyUserCommand } from "@/application/commands";
import { InvalidCredentialsError } from "@/domain/errors";
import { VerifyUserRequest } from "@/infrastructure/http/requests";
import { VerifyUserResponse } from "@/infrastructure/http/responses";

@Controller("user")
export class VerifyUserController {
  private readonly logger = new Logger(VerifyUserController.name);

  public constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.OK)
  @Version("1")
  @Post("verify")
  public async handle(
    @Body() request: VerifyUserRequest,
  ): Promise<VerifyUserResponse> {
    const command = request.toCommand();

    try {
      const userId = await this.commandBus.execute<VerifyUserCommand, string>(
        command,
      );

      return new VerifyUserResponse(userId);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new NotFoundException();
      }

      this.logger.error("Fail to verify an user", error);

      throw new InternalServerErrorException(
        "Fail to verify your user, please try again later.",
      );
    }
  }
}
