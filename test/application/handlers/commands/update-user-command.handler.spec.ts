import { omit } from "lodash";
import { Some } from "oxide.ts";

import { UpdateUserCommandHandler } from "@/application/handlers/commands";
import { PasswordService } from "@/application/services";
import {
  EmailAlreadyInUseError,
  UserNotFoundError,
  UserUpdateError,
} from "@/domain/errors";
import { User } from "@/domain/models";
import {
  FindUserByEmailRepository,
  FindUserByIdRepository,
  UpdateUserRepository,
} from "@/domain/repositories";

import { UpdateUserCommandBuilder, UserBuilder } from "@test/builders";
import { disableLogs } from "@test/helpers";
import {
  FindUserByEmailRepositoryMock,
  FindUserByIdRepositoryMock,
  PasswordServiceMock,
  UpdateUserRepositoryMock,
} from "@test/mocks";

interface Sut {
  sut: UpdateUserCommandHandler;
  deps: {
    findUserByIdRepository: FindUserByIdRepository;
    findUserByEmailRepository: FindUserByEmailRepository;
    updateUserRepository: UpdateUserRepository;
    passwordService: PasswordService;
  };
}

function makeSut(): Sut {
  const deps: Sut["deps"] = {
    findUserByIdRepository: new FindUserByIdRepositoryMock(),
    findUserByEmailRepository: new FindUserByEmailRepositoryMock(),
    updateUserRepository: new UpdateUserRepositoryMock(),
    passwordService: new PasswordServiceMock(),
  };
  const sut = new UpdateUserCommandHandler(
    deps.findUserByIdRepository,
    deps.findUserByEmailRepository,
    deps.updateUserRepository,
    deps.passwordService,
  );

  disableLogs(sut);

  return { sut, deps };
}

describe(UpdateUserCommandHandler.name, () => {
  it("should fully update an user when email is available", async () => {
    // given
    const user = new UserBuilder().build();
    const command = new UpdateUserCommandBuilder().withId(user.id).build();
    const { sut, deps } = makeSut();
    const { findUserByIdRepository, passwordService, updateUserRepository } =
      deps;
    jest
      .spyOn(findUserByIdRepository, "findById")
      .mockResolvedValueOnce(Some(new User(user)));
    const updateSpy = jest.spyOn(updateUserRepository, "update");
    user.update({
      ...command.userProps,
      password: await passwordService.hash(
        command.userProps.password as string,
      ),
    });

    // when
    await sut.execute(command);

    // then
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining(omit(user, "updatedAt")),
    );
  });

  it("should update an user when email is not in the input", async () => {
    // given
    const user = new UserBuilder().build();
    const command = new UpdateUserCommandBuilder().withId(user.id).build();
    delete command.userProps.email;
    delete command.userProps.password;
    const { sut, deps } = makeSut();
    const { findUserByIdRepository, updateUserRepository } = deps;
    jest
      .spyOn(findUserByIdRepository, "findById")
      .mockResolvedValueOnce(Some(new User(user)));
    const updateSpy = jest.spyOn(updateUserRepository, "update");
    user.update(command.userProps);

    // when
    await sut.execute(command);

    // then
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining(omit(user, "updatedAt")),
    );
  });

  it("should throw an UserNotFoundError", async () => {
    // given
    const user = new UserBuilder().build();
    const command = new UpdateUserCommandBuilder().withId(user.id).build();
    const { sut } = makeSut();

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it("should throw an EmailAlreadyInUseError", async () => {
    // given
    const user = new UserBuilder().build();
    const command = new UpdateUserCommandBuilder().withId(user.id).build();
    const { sut, deps } = makeSut();
    const { findUserByIdRepository, findUserByEmailRepository } = deps;
    jest
      .spyOn(findUserByIdRepository, "findById")
      .mockResolvedValueOnce(Some(new User(user)));
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockResolvedValueOnce(Some(new User(user)));

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it("should throw an UserUpdateError when FindUserByIdRepository throws", async () => {
    // given
    const user = new UserBuilder().build();
    const command = new UpdateUserCommandBuilder().withId(user.id).build();
    const { sut, deps } = makeSut();
    const { findUserByIdRepository } = deps;
    jest
      .spyOn(findUserByIdRepository, "findById")
      .mockRejectedValueOnce(new Error());

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).rejects.toBeInstanceOf(UserUpdateError);
  });

  it("should throw an UserUpdateError when FindUserByEmailRepository throws", async () => {
    // given
    const user = new UserBuilder().build();
    const command = new UpdateUserCommandBuilder().withId(user.id).build();
    const { sut, deps } = makeSut();
    const { findUserByIdRepository, findUserByEmailRepository } = deps;
    jest
      .spyOn(findUserByIdRepository, "findById")
      .mockResolvedValueOnce(Some(new User(user)));
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockRejectedValueOnce(new Error());

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).rejects.toBeInstanceOf(UserUpdateError);
  });

  it("should throw an UserUpdateError when PasswordService throws", async () => {
    // given
    const user = new UserBuilder().build();
    const command = new UpdateUserCommandBuilder().withId(user.id).build();
    const { sut, deps } = makeSut();
    const { findUserByIdRepository, passwordService } = deps;
    jest
      .spyOn(findUserByIdRepository, "findById")
      .mockResolvedValueOnce(Some(new User(user)));
    jest.spyOn(passwordService, "hash").mockRejectedValueOnce(new Error());

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).rejects.toBeInstanceOf(UserUpdateError);
  });

  it("should throw an UserUpdateError when UpdateUserRepository throws", async () => {
    // given
    const user = new UserBuilder().build();
    const command = new UpdateUserCommandBuilder().withId(user.id).build();
    const { sut, deps } = makeSut();
    const { findUserByIdRepository, updateUserRepository } = deps;
    jest
      .spyOn(findUserByIdRepository, "findById")
      .mockResolvedValueOnce(Some(new User(user)));
    jest
      .spyOn(updateUserRepository, "update")
      .mockRejectedValueOnce(new Error());

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).rejects.toBeInstanceOf(UserUpdateError);
  });
});
