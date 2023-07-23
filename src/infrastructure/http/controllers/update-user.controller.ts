import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Logger,
  Patch,
  Version,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { UpdateUserCommand } from "@/application/commands";
import { EmailAlreadyInUseError, UserNotFoundError } from "@/domain/errors";
import { UserId } from "@/infrastructure/http/decorators";
import { JwtAuthGuard } from "@/infrastructure/http/guards";
import { UpdateUserRequest } from "@/infrastructure/http/requests";

@Controller("user")
export class UpdateUserController {
  private readonly logger = new Logger(UpdateUserController.name);

  public constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Version("1")
  @Patch()
  public async handle(
    @UserId() userId: string,
    @Body() request: UpdateUserRequest,
  ): Promise<void> {
    const command = request.toCommand(userId);

    try {
      await this.commandBus.execute<UpdateUserCommand>(command);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException("User not found");
      }

      if (error instanceof EmailAlreadyInUseError) {
        throw new ConflictException(
          `Email "${request.email}" is already in use by another user.`,
        );
      }

      this.logger.error("Fail to update user", error);

      throw new InternalServerErrorException(
        "Fail to update your user, please try again later.",
      );
    }
  }
}
