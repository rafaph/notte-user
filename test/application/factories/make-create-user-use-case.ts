import { CreateUserUseCase } from "@/application/use-cases/create-user-use-case";
import { CreateUserRepository } from "@/domain/repositories/create-user-repository";
import { GetUserByEmailRepository } from "@/domain/repositories/get-user-by-email-repository";
import { PasswordHasherService } from "@/domain/services/password-hasher-service";

import { makeCreateUserRepository } from "@test/application/factories/make-create-user-repository";
import { makeGetUserByEmailRepository } from "@test/application/factories/make-get-user-by-email-repository";
import { makePasswordHasherService } from "@test/application/factories/make-password-hasher-service";
import { CheckerEventEmitter } from "@test/doubles/checker-event-emitter";

export interface SutTypes {
  getUserByEmailRepository: GetUserByEmailRepository;
  passwordHasherService: PasswordHasherService;
  createUserRepository: CreateUserRepository;
  eventEmitter: CheckerEventEmitter;
  useCase: CreateUserUseCase;
}

export const makeCreateUserUseCase = (
  sut: Partial<SutTypes> = {},
): SutTypes => {
  const getUserByEmailRepository =
    sut.getUserByEmailRepository ?? makeGetUserByEmailRepository();
  const passwordHasherService =
    sut.passwordHasherService ?? makePasswordHasherService();
  const createUserRepository =
    sut.createUserRepository ?? makeCreateUserRepository();
  const eventEmitter = sut.eventEmitter ?? new CheckerEventEmitter();

  return {
    getUserByEmailRepository,
    passwordHasherService,
    createUserRepository,
    eventEmitter,
    useCase: new CreateUserUseCase(
      getUserByEmailRepository,
      passwordHasherService,
      createUserRepository,
      eventEmitter,
    ),
  };
};
