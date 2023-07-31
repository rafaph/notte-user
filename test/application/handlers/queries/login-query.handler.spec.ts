import { faker } from "@faker-js/faker";
import { Some } from "oxide.ts";

import { LoginQueryHandler } from "@/application/handlers/queries";
import { LoginQuery } from "@/application/queries";
import { LoginResult } from "@/application/queries/results";
import { PasswordService, TokenService } from "@/application/services";
import { InvalidCredentialsError, LoginError } from "@/domain/errors";
import { FindUserByEmailRepository } from "@/domain/repositories";

import { UserBuilder } from "@test/builders";
import { disableLogs } from "@test/helpers";
import {
  FindUserByEmailRepositoryMock,
  PasswordServiceMock,
  TokenServiceMock,
} from "@test/mocks";

interface Sut {
  sut: LoginQueryHandler;
  deps: {
    findUserByEmailRepository: FindUserByEmailRepository;
    passwordService: PasswordService;
    tokenService: TokenService;
  };
}

function makeSut(): Sut {
  const deps: Sut["deps"] = {
    findUserByEmailRepository: new FindUserByEmailRepositoryMock(),
    passwordService: new PasswordServiceMock(),
    tokenService: new TokenServiceMock(),
  };

  const sut = new LoginQueryHandler(
    deps.findUserByEmailRepository,
    deps.passwordService,
    deps.tokenService,
  );

  disableLogs(sut);

  return { sut, deps };
}

describe(LoginQueryHandler.name, () => {
  it("should return the token", async () => {
    // given
    const password = faker.internet.password();
    const { sut, deps } = makeSut();
    const { findUserByEmailRepository, passwordService, tokenService } = deps;
    const hashedPassword = await passwordService.hash(password);
    const user = new UserBuilder().withPassword(hashedPassword).build();
    const { email, id } = user;
    const expectedQueryResult: LoginResult = {
      token: await tokenService.sign(id),
    };
    const loginQuery = new LoginQuery(email, password);
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockResolvedValueOnce(Some(user));

    // when
    const queryResult = await sut.execute(loginQuery);

    // then
    expect(queryResult).toEqual(expectedQueryResult);
  });

  it("should throw an InvalidCredentialsError when user is not found", async () => {
    // given
    const { sut } = makeSut();
    const { email, password } = new UserBuilder().build();
    const loginQuery = new LoginQuery(email, password);

    // when
    const queryResultPromise = sut.execute(loginQuery);

    // then
    await expect(queryResultPromise).rejects.toBeInstanceOf(
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
    const loginQuery = new LoginQuery(email, password);
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockResolvedValueOnce(Some(user));

    // when
    const queryResultPromise = sut.execute(loginQuery);

    // then
    await expect(queryResultPromise).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it("should throw a LoginError when FindUserByEmailRepository throws", async () => {
    // given
    const { email, password } = new UserBuilder().build();
    const loginQuery = new LoginQuery(email, password);
    const { sut, deps } = makeSut();
    jest
      .spyOn(deps.findUserByEmailRepository, "findByEmail")
      .mockRejectedValueOnce(new Error());

    // when
    const queryResultPromise = sut.execute(loginQuery);

    // then
    await expect(queryResultPromise).rejects.toBeInstanceOf(LoginError);
  });

  it("should throw a LoginError when PasswordService throws", async () => {
    // given
    const { sut, deps } = makeSut();
    const { findUserByEmailRepository, passwordService } = deps;
    const user = new UserBuilder().build();
    const loginQuery = new LoginQuery(user.email, user.password);
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockResolvedValueOnce(Some(user));
    jest.spyOn(passwordService, "verify").mockRejectedValueOnce(new Error());

    // when
    const queryResultPromise = sut.execute(loginQuery);

    // then
    await expect(queryResultPromise).rejects.toBeInstanceOf(LoginError);
  });

  it("should throw a LoginError when TokenService throws", async () => {
    // given
    const password = faker.internet.password();
    const { sut, deps } = makeSut();
    const { findUserByEmailRepository, passwordService, tokenService } = deps;
    const hashedPassword = await passwordService.hash(password);
    const user = new UserBuilder().withPassword(hashedPassword).build();
    const { email } = user;
    const loginQuery = new LoginQuery(email, password);
    jest
      .spyOn(findUserByEmailRepository, "findByEmail")
      .mockResolvedValueOnce(Some(user));
    jest.spyOn(tokenService, "sign").mockRejectedValueOnce(new Error());

    // when
    const queryResultPromise = sut.execute(loginQuery);

    // then
    await expect(queryResultPromise).rejects.toBeInstanceOf(LoginError);
  });
});
