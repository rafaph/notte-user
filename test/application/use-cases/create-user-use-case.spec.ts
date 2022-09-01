import { faker } from "@faker-js/faker";
import { Some } from "oxide.ts";

import { EmailAlreadyTakenEvent } from "@/application/events/email-already-taken-event";
import { UserCreatedEvent } from "@/application/events/user-created-event";
import { UserNotCreatedEvent } from "@/application/events/user-not-created-event";
import { CreateUserUseCase } from "@/application/use-cases/create-user-use-case";

import { makeCreateUserUseCase } from "@test/application/factories/make-create-user-use-case";
import { makeCreateUserUseCaseInput } from "@test/application/factories/make-create-user-use-case-input";
import { makeGetUserByEmailRepository } from "@test/application/factories/make-get-user-by-email-repository";
import { makeUser } from "@test/domain/factories/make-user";
import { assertEmittedEvent } from "@test/helpers/assert-emitted-event";

describe(CreateUserUseCase.name, () => {
  it("should emit an UserCreatedEvent when create with success", async () => {
    // given
    const { useCase, eventEmitter } = makeCreateUserUseCase();
    const input = makeCreateUserUseCaseInput();
    // when
    await useCase.execute(input);
    // then
    assertEmittedEvent(UserCreatedEvent, eventEmitter);
  });

  it("should emit an EmailAlreadyTakenEvent if email is already taken by another user", async () => {
    // given
    const getUserByEmailRepository = makeGetUserByEmailRepository(
      Promise.resolve(Some(makeUser())),
    );
    const { useCase, eventEmitter } = makeCreateUserUseCase({
      getUserByEmailRepository,
    });
    const input = makeCreateUserUseCaseInput();
    // when
    await useCase.execute(input);
    // then
    assertEmittedEvent(EmailAlreadyTakenEvent, eventEmitter);
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
    assertEmittedEvent(UserNotCreatedEvent, eventEmitter);
  });
});
