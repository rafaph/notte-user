import { CreateUserCommandHandler } from "@/user/application/handlers";
import { PasswordHasherService } from "@/user/application/services";
import {
  EmailAlreadyInUseError,
  UserCreationError,
} from "@/user/domain/errors";
import {
  CreateUserRepository,
  UserExistsRepository,
} from "@/user/domain/repositories";

import { CreateUserCommandBuilder } from "@test/user/builders";
import {
  CreateUserRepositoryMock,
  PasswordHasherServiceMock,
  UserExistsRepositoryMock,
} from "@test/user/mocks";

interface SutType {
  sut: CreateUserCommandHandler;
  deps: {
    userExistsRepository: UserExistsRepository;
    createUserRepository: CreateUserRepository;
    passwordHasher: PasswordHasherService;
  };
}

function makeSut(): SutType {
  const deps: SutType["deps"] = {
    userExistsRepository: new UserExistsRepositoryMock(),
    createUserRepository: new CreateUserRepositoryMock(),
    passwordHasher: new PasswordHasherServiceMock(),
  };
  const sut = new CreateUserCommandHandler(
    deps.userExistsRepository,
    deps.createUserRepository,
    deps.passwordHasher,
  );

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
    const { userExistsRepository } = deps;
    const command = new CreateUserCommandBuilder().build();
    jest.spyOn(userExistsRepository, "exists").mockResolvedValueOnce(true);

    // when
    const execute = sut.execute(command);

    // then
    await expect(execute).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it("should throw an UserCreationError when userExistsRepository fails", async () => {
    // given
    const { sut, deps } = makeSut();
    const { userExistsRepository } = deps;
    const command = new CreateUserCommandBuilder().build();
    jest.spyOn(userExistsRepository, "exists").mockRejectedValueOnce(undefined);

    // when
    const execute = sut.execute(command);

    // then
    await expect(execute).rejects.toBeInstanceOf(UserCreationError);
  });

  it("should throw an UserCreationError when passwordHasher fails", async () => {
    // given
    const { sut, deps } = makeSut();
    const { passwordHasher } = deps;
    const command = new CreateUserCommandBuilder().build();
    jest.spyOn(passwordHasher, "hash").mockRejectedValueOnce(undefined);

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
