import { faker } from "@faker-js/faker";

import { EmailAlreadyTakenEvent } from "@/application/events/email-already-taken-event";
import { UserCreatedEvent } from "@/application/events/user-created-event";
import { UserNotCreatedEvent } from "@/application/events/user-not-created-event";
import { CreateUserUseCase } from "@/application/use-cases/create-user-use-case";

import { SuccessGetUserByEmailRepository } from "@test/application/doubles/success-get-user-by-email-repository";
import { makeCreateUserUseCase } from "@test/application/factories/make-create-user-use-case";
import { makeCreateUserUseCaseInput } from "@test/application/factories/make-create-user-use-case-input";

describe(CreateUserUseCase.name, () => {
  it("should emit an UserCreatedEvent when create with success", async () => {
    // given
    const { useCase, eventEmitter } = makeCreateUserUseCase();
    const input = makeCreateUserUseCaseInput();
    // when
    await useCase.execute(input);
    // then
    eventEmitter.assert(UserCreatedEvent);
  });

  it("should emit an EmailAlreadyTakenEvent if email is already taken by another user", async () => {
    // given
    const { useCase, eventEmitter } = makeCreateUserUseCase({
      getUserByEmailRepository: new SuccessGetUserByEmailRepository(),
    });

    const input = makeCreateUserUseCaseInput();
    // when
    await useCase.execute(input);
    // then
    eventEmitter.assert(EmailAlreadyTakenEvent);
  });

  it("should emit an UserNotCreatedEvent when email is invalid", async () => {
    // given
    const { useCase, eventEmitter } = makeCreateUserUseCase();
    const input = makeCreateUserUseCaseInput({
      email: faker.name.firstName(),
    });
    // when
    await useCase.execute(input);
    // then
    eventEmitter.assert(UserNotCreatedEvent);
  });
});
