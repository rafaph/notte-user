import { faker } from "@faker-js/faker";
import * as argon2 from "argon2";

import { Argon2PasswordService } from "@/infrastructure/services";

import { AppConfigBuilder } from "@test/builders/app-config.builder";

jest.mock("argon2", () => ({
  hash: jest.fn((password: string) => Promise.resolve(`hashed_${password}`)),
  verify: jest.fn((hash: string, password: string) =>
    Promise.resolve(hash === `hashed_${password}`),
  ),
}));

function makeSut(): Argon2PasswordService {
  const config = new AppConfigBuilder().build();
  return new Argon2PasswordService(config);
}

describe(Argon2PasswordService.name, () => {
  it("should hash a password", async () => {
    // given
    const sut = makeSut();
    const password = faker.internet.password();

    // when
    const hashedPassword = await sut.hash(password);

    // then
    expect(hashedPassword).toBe(`hashed_${password}`);
    expect(argon2.hash).toHaveBeenCalledWith(password, expect.anything());
  });

  it("should verify a password", async () => {
    // given
    const sut = makeSut();
    const password = faker.internet.password();
    const hashedPassword = `hashed_${password}`;

    // when
    const isPasswordValid = await sut.verify(hashedPassword, password);

    // then
    expect(isPasswordValid).toBe(true);
    expect(argon2.verify).toHaveBeenCalledWith(
      hashedPassword,
      password,
      expect.anything(),
    );
  });

  it("should reject an invalid password", async () => {
    // given
    const sut = makeSut();
    const password = faker.internet.password();
    const invalidPassword = faker.internet.password();
    const hashedPassword = await sut.hash(password);

    // when
    const isPasswordValid = await sut.verify(hashedPassword, invalidPassword);

    // then
    expect(isPasswordValid).toBe(false);
    expect(argon2.verify).toHaveBeenCalledWith(
      hashedPassword,
      invalidPassword,
      expect.anything(),
    );
  });
});
