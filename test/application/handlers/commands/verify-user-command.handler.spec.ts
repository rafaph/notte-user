import { faker } from "@faker-js/faker";

import { VerifyUserCommand } from "@/application/commands";
import { VerifyUserCommandHandler } from "@/application/handlers/commands";
import { PasswordService } from "@/application/services";
import {
  InvalidCredentialsError,
  UserVerificationError,
} from "@/domain/errors";
import { FindUserByEmailRepository } from "@/domain/repositories";

import { UserBuilder } from "@test/builders";
import { disableLogs } from "@test/helpers";
import {
  FindUserByEmailRepositoryMock,
  PasswordServiceMock,
} from "@test/mocks";

interface Sut {
  sut: VerifyUserCommandHandler;
  deps: {
    findUserByEmailRepository: FindUserByEmailRepository;
    passwordService: PasswordService;
  };
}

function makeSut(): Sut {
  const deps: Sut["deps"] = {
    findUserByEmailRepository: new FindUserByEmailRepositoryMock(),
    passwordService: new PasswordServiceMock(),
  };

  const sut = new VerifyUserCommandHandler(
    deps.findUserByEmailRepository,
    deps.passwordService,
  );

  disableLogs(sut);

  return { sut, deps };
}

describe(VerifyUserCommandHandler.name, () => {
  it("should not throw when user is verified", async () => {
    // given
    const password = faker.internet.password();
    const { sut, deps } = makeSut();
    const { findUserByEmailRepository, passwordService } = deps;
    const hashedPassword = await passwordService.hash(password);
    const user = new UserBuilder().withPassword(hashedPassword).build();
    const { email } = user;
    const command = new VerifyUserCommand(email, password);
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockResolvedValueOnce(user);

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).resolves.toBeUndefined();
  });

  it("should throw an InvalidCredentialsError when user is not found", async () => {
    // given
    const { sut } = makeSut();
    const { email, password } = new UserBuilder().build();
    const command = new VerifyUserCommand(email, password);

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it("should throw an InvalidCredentialsError when password is not correct", async () => {
    // given
    const password = faker.internet.password();
    const { sut, deps } = makeSut();
    const { findUserByEmailRepository, passwordService } = deps;
    const hashedPassword = await passwordService.hash(
      faker.internet.password(),
    );
    const user = new UserBuilder().withPassword(hashedPassword).build();
    const { email } = user;
    const command = new VerifyUserCommand(email, password);
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockResolvedValueOnce(user);

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it("should throw a UserVerificationError when FindUserByEmailRepository throws", async () => {
    // given
    const { email, password } = new UserBuilder().build();
    const command = new VerifyUserCommand(email, password);
    const { sut, deps } = makeSut();
    jest
      .spyOn(deps.findUserByEmailRepository, "findByEmail")
      .mockRejectedValueOnce(new Error());

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).rejects.toBeInstanceOf(UserVerificationError);
  });

  it("should throw a UserVerificationError when PasswordService throws", async () => {
    // given
    const { sut, deps } = makeSut();
    const { findUserByEmailRepository, passwordService } = deps;
    const user = new UserBuilder().build();
    const command = new VerifyUserCommand(user.email, user.password);
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockResolvedValueOnce(user);
    jest.spyOn(passwordService, "verify").mockRejectedValueOnce(new Error());

    // when
    const executePromise = sut.execute(command);

    // then
    await expect(executePromise).rejects.toBeInstanceOf(UserVerificationError);
  });
});
