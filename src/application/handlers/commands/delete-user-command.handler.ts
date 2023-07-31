import { Logger } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { DeleteUserCommand } from "@/application/commands";
import { UserDeleteError } from "@/domain/errors";
import { DeleteUserRepository } from "@/domain/repositories";

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  private readonly logger = new Logger(DeleteUserCommandHandler.name);

  public constructor(
    private readonly deleteUserRepository: DeleteUserRepository,
  ) {}

  public async execute({ userId }: DeleteUserCommand): Promise<void> {
    try {
      await this.deleteUserRepository.delete(userId);
    } catch (error) {
      this.logger.error("Fail to delete user", error);

      throw new UserDeleteError();
    }
  }
}
