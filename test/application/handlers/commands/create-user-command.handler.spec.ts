import { Some } from "oxide.ts";

import { CreateUserCommandHandler } from "@/application/handlers/commands";
import { PasswordService } from "@/application/services";
import { EmailAlreadyInUseError, UserCreationError } from "@/domain/errors";
import {
  CreateUserRepository,
  FindUserByEmailRepository,
} from "@/domain/repositories";

import { CreateUserCommandBuilder, UserBuilder } from "@test/builders";
import { disableLogs } from "@test/helpers";
import {
  PasswordServiceMock,
  CreateUserRepositoryMock,
  FindUserByEmailRepositoryMock,
} from "@test/mocks";

interface SutType {
  sut: CreateUserCommandHandler;
  deps: {
    findUserByEmailRepository: FindUserByEmailRepository;
    createUserRepository: CreateUserRepository;
    passwordService: PasswordService;
  };
}

function makeSut(): SutType {
  const deps: SutType["deps"] = {
    findUserByEmailRepository: new FindUserByEmailRepositoryMock(),
    createUserRepository: new CreateUserRepositoryMock(),
    passwordService: new PasswordServiceMock(),
  };
  const sut = new CreateUserCommandHandler(
    deps.findUserByEmailRepository,
    deps.createUserRepository,
    deps.passwordService,
  );

  disableLogs(sut);

  return { sut, deps };
}

describe(CreateUserCommandHandler.name, () => {
  it("should create an user", async () => {
    // given
    const { sut, deps } = makeSut();
    const { createUserRepository } = deps;
    const command = new CreateUserCommandBuilder().build();
    const createSpy = jest.spyOn(createUserRepository, "create");

    // when
    await sut.execute(command);

    // then
    expect(createSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw an EmailAlreadyInUseError", async () => {
    // given
    const { sut, deps } = makeSut();
    const { findUserByEmailRepository } = deps;
    const command = new CreateUserCommandBuilder().build();
    const user = new UserBuilder().build();
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockResolvedValueOnce(Some(user));

    // when
    const execute = sut.execute(command);

    // then
    await expect(execute).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it("should throw an UserCreationError when userExistsRepository fails", async () => {
    // given
    const { sut, deps } = makeSut();
    const { findUserByEmailRepository } = deps;
    const command = new CreateUserCommandBuilder().build();
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockRejectedValueOnce(undefined);

    // when
    const execute = sut.execute(command);

    // then
    await expect(execute).rejects.toBeInstanceOf(UserCreationError);
  });

  it("should throw an UserCreationError when passwordHasher fails", async () => {
    // given
    const { sut, deps } = makeSut();
    const { passwordService } = deps;
    const command = new CreateUserCommandBuilder().build();
    jest.spyOn(passwordService, "hash").mockRejectedValueOnce(undefined);

    // when
    const execute = sut.execute(command);

    // then
    await expect(execute).rejects.toBeInstanceOf(UserCreationError);
  });

  it("should throw an UserCreationError when createUserRepository fails", async () => {
    // given
    const { sut, deps } = makeSut();
    const { createUserRepository } = deps;
    const command = new CreateUserCommandBuilder().build();
    jest.spyOn(createUserRepository, "create").mockRejectedValueOnce(undefined);

    // when
    const execute = sut.execute(command);

    // then
    await expect(execute).rejects.toBeInstanceOf(UserCreationError);
  });
});
