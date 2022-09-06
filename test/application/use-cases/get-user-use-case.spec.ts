import { None } from "oxide.ts";
import sinon from "sinon";

import { UserFoundEvent } from "@/application/events/user-found-event";
import { UserNotFoundEvent } from "@/application/events/user-not-found-event";
import { GetUserUseCase } from "@/application/use-cases/get-user-use-case";

import { makeGetUserUseCase } from "@test/application/factories/make-get-user-use-case";
import { makeGetUserUseCaseInput } from "@test/application/factories/make-get-user-use-case-input";

describe(GetUserUseCase.name, () => {
  it("should emit UserNotFoundEvent when user not found by an email", async () => {
    // given
    const { getUserByEmailRepository, eventEmitter, useCase } =
      makeGetUserUseCase();
    const getByEmailStub = sinon
      .stub(getUserByEmailRepository, "getByEmail")
      .resolves(None);
    const input = makeGetUserUseCaseInput();
    // when
    await useCase.execute(input);
    // then
    expect(getByEmailStub).to.have.been.calledOnceWith(input.email);
    eventEmitter.assert(UserNotFoundEvent);
  });

  it("should emit UserNotFoundEvent when user is found but password is incorrect", async () => {
    // given
    const {
      getUserByEmailRepository,
      passwordVerifierService,
      eventEmitter,
      useCase,
    } = makeGetUserUseCase();
    const verifyStub = sinon
      .stub(passwordVerifierService, "verify")
      .resolves(false);
    const user = getUserByEmailRepository.user.unwrap();
    const input = makeGetUserUseCaseInput();
    // when
    await useCase.execute(input);
    // then
    expect(verifyStub).to.have.been.calledOnceWith(
      input.password,
      user.password,
    );
    eventEmitter.assert(UserNotFoundEvent);
  });

  it("should emit UserFoundEvent when user is found and password is correct", async () => {
    // given
    const { getUserByEmailRepository, eventEmitter, useCase } =
      makeGetUserUseCase();
    const input = makeGetUserUseCaseInput();
    const user = getUserByEmailRepository.user.unwrap();
    // when
    await useCase.execute(input);
    // then
    eventEmitter.assert(UserFoundEvent);
    expect(user).to.containSubset(eventEmitter.get(UserFoundEvent).data);
  });
});
