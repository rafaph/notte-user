import { GetUserUseCase } from "@/application/use-cases/get-user-use-case";
import { PasswordVerifierService } from "@/domain/services/password-verifier-service";

import { CheckerEventEmitter } from "@test/application/doubles/checker-event-emitter";
import { SuccessGetUserByEmailRepository } from "@test/application/doubles/success-get-user-by-email-repository";
import { SuccessPasswordVerifierService } from "@test/application/doubles/success-password-verifier-service";

export interface SutTypes {
  getUserByEmailRepository: SuccessGetUserByEmailRepository;
  passwordVerifierService: PasswordVerifierService;
  eventEmitter: CheckerEventEmitter;
  useCase: GetUserUseCase;
}

export const makeGetUserUseCase = (sut: Partial<SutTypes> = {}): SutTypes => {
  const getUserByEmailRepository =
    sut.getUserByEmailRepository ?? new SuccessGetUserByEmailRepository();

  const passwordVerifierService =
    sut.passwordVerifierService ?? new SuccessPasswordVerifierService();

  const eventEmitter = sut.eventEmitter ?? new CheckerEventEmitter();

  return {
    getUserByEmailRepository,
    passwordVerifierService,
    eventEmitter,
    useCase: new GetUserUseCase(
      getUserByEmailRepository,
      passwordVerifierService,
      eventEmitter,
    ),
  };
};
