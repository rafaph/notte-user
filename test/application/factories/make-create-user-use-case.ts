import { None } from "oxide.ts";

import { CreateUserUseCase } from "@/application/use-cases/create-user-use-case";
import { CreateUserRepository } from "@/domain/repositories/create-user-repository";
import { GetUserByEmailRepository } from "@/domain/repositories/get-user-by-email-repository";
import { PasswordHasherService } from "@/domain/services/password-hasher-service";

import { CheckerEventEmitter } from "@test/application/doubles/checker-event-emitter";
import { SuccessCreateUserRepository } from "@test/application/doubles/success-create-user-repository";
import { SuccessGetUserByEmailRepository } from "@test/application/doubles/success-get-user-by-email-repository";
import { SuccessPasswordHasherService } from "@test/application/doubles/success-password-hasher-service";

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
    sut.getUserByEmailRepository ?? new SuccessGetUserByEmailRepository(None);

  const passwordHasherService =
    sut.passwordHasherService ?? new SuccessPasswordHasherService();

  const createUserRepository =
    sut.createUserRepository ?? new SuccessCreateUserRepository();

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
