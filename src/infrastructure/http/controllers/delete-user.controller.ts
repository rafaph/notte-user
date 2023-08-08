import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Version,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { DeleteUserCommand } from "@/application/commands";
import { UserId } from "@/infrastructure/http/decorators";

@Controller("user")
export class DeleteUserController {
  private readonly logger = new Logger(DeleteUserController.name);

  public constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Version("1")
  @Delete(":userId")
  public async handle(@UserId() userId: string): Promise<void> {
    const command = new DeleteUserCommand(userId);

    try {
      await this.commandBus.execute<DeleteUserCommand>(command);
    } catch (error) {
      this.logger.error("Fail to delete user", error);

      throw new InternalServerErrorException(
        "Fail to delete your user, please try again later.",
      );
    }
  }
}
