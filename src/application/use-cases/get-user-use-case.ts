import { injectable } from "inversify";

import { UserFoundEvent } from "@/application/events/user-found-event";
import { UserNotFoundEvent } from "@/application/events/user-not-found-event";
import { UseCase } from "@/application/interfaces/use-case";
import { UserProps } from "@/domain/entities/user";
import { GetUserByEmailRepository } from "@/domain/repositories/get-user-by-email-repository";
import { EventEmitter } from "@/domain/services/event-emitter";
import { PasswordVerifierService } from "@/domain/services/password-verifier-service";

export type GetUserUseCaseInput = Pick<UserProps, "email" | "password">;

@injectable()
export class GetUserUseCase implements UseCase<GetUserUseCaseInput> {
  public constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly passwordVerifierService: PasswordVerifierService,
    private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(input: GetUserUseCaseInput): Promise<void> {
    const userOption = await this.getUserByEmailRepository.getByEmail(
      input.email,
    );

    if (userOption.isNone()) {
      return this.eventEmitter.emit(new UserNotFoundEvent());
    }

    const user = userOption.unwrap();
    const isCorrectPassword = await this.passwordVerifierService.verify(
      input.password,
      user.password,
    );

    if (!isCorrectPassword) {
      return this.eventEmitter.emit(new UserNotFoundEvent());
    }

    return this.eventEmitter.emit(new UserFoundEvent({ id: user.id }));
  }
}
