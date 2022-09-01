import { faker } from "@faker-js/faker";
import * as argon2 from "argon2";

import { Argon2PasswordService } from "@/infra/services/argon2-password-service";

describe(Argon2PasswordService.name, () => {
  it("should hash a password", async () => {
    // given
    const password = faker.internet.password();
    const passwordHasherService = new Argon2PasswordService();
    // when
    const hash = await passwordHasherService.hash(password);
    // then
    expect(hash).to.be.a("string");
    await expect(argon2.verify(hash, password)).to.eventually.be.true;
  });

  it("should verify a password", async () => {
    // given
    const password = faker.internet.password();
    const hash = await argon2.hash(password);
    const passwordHasherService = new Argon2PasswordService();
    // when
    const isValidHash = await passwordHasherService.verify(password, hash);
    // then
    expect(isValidHash).to.be.true;
  });
});
