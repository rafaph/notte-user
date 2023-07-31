import {
  Controller,
  Delete,
  InternalServerErrorException,
  Logger,
  UseGuards,
  Version,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { DeleteUserCommand } from "@/application/commands";
import { UserId } from "@/infrastructure/http/decorators";
import { JwtAuthGuard } from "@/infrastructure/http/guards";

@Controller("user")
export class DeleteUserController {
  private readonly logger = new Logger(DeleteUserController.name);

  public constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Version("1")
  @Delete()
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
