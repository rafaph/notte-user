import { randomUUID } from "crypto";

import { injectable } from "inversify";
import { Result } from "oxide.ts";

import { EmailAlreadyTakenEvent } from "@/application/events/email-already-taken-event";
import { UserCreatedEvent } from "@/application/events/user-created-event";
import { UserNotCreatedEvent } from "@/application/events/user-not-created-event";
import { UseCase } from "@/application/interfaces/use-case";
import { User, UserProps } from "@/domain/entities/user";
import { InvalidEntityError } from "@/domain/errors/invalid-entity-error";
import { CreateUserRepository } from "@/domain/repositories/create-user-repository";
import { GetUserByEmailRepository } from "@/domain/repositories/get-user-by-email-repository";
import { EventEmitter } from "@/domain/services/event-emitter";
import { PasswordHasherService } from "@/domain/services/password-hasher-service";

export type CreateUserUseCaseInput = Omit<
  UserProps,
  "id" | "createdAt" | "updatedAt"
>;

@injectable()
export class CreateUserUseCase implements UseCase<CreateUserUseCaseInput> {
  public constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly passwordHasherService: PasswordHasherService,
    private readonly createUserRepository: CreateUserRepository,
    private readonly eventEmitter: EventEmitter,
  ) {}

  private async userAlreadyExists(email: string): Promise<boolean> {
    const userOption = await this.getUserByEmailRepository.getByEmail(email);

    return userOption.isSome();
  }

  private async createUser(
    input: CreateUserUseCaseInput,
  ): Promise<Result<User, InvalidEntityError>> {
    const password = await this.passwordHasherService.hash(input.password);
    const createdAt = new Date();
    const updatedAt = createdAt;
    const id = randomUUID();
    return User.create({
      ...input,
      password,
      createdAt,
      updatedAt,
      id,
    });
  }

  public async execute(input: CreateUserUseCaseInput): Promise<void> {
    if (await this.userAlreadyExists(input.email)) {
      return this.eventEmitter.emit(new EmailAlreadyTakenEvent());
    }

    const userResult = await this.createUser(input);

    if (userResult.isErr()) {
      return this.eventEmitter.emit(
        new UserNotCreatedEvent(userResult.unwrapErr()),
      );
    }

    const user = userResult.unwrap();

    await this.createUserRepository.create(user);

    return this.eventEmitter.emit(new UserCreatedEvent({ id: user.id }));
  }
}
