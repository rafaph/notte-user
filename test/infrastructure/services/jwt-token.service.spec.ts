import { faker } from "@faker-js/faker";

import { AppConfig } from "@/config";
import { JwtTokenService } from "@/infrastructure/services";

import { AppConfigBuilder } from "@test/builders/app-config.builder";
import { disableLogs } from "@test/helpers";

interface Sut {
  sut: JwtTokenService;
  deps: {
    config: AppConfig;
  };
}

function makeSut(): Sut {
  const deps: Sut["deps"] = {
    config: new AppConfigBuilder().build(),
  };
  const sut = new JwtTokenService(deps.config);

  disableLogs(sut);

  return { sut, deps };
}

describe(JwtTokenService.name, () => {
  let sut: JwtTokenService;

  beforeAll(() => {
    sut = makeSut().sut;
  });

  it("should to sign a token", async () => {
    // given
    const payload = faker.string.uuid();

    // when
    const token = await sut.sign(payload);

    // then
    expect(token).toBeDefined();
  });

  it("should to verify a token", async () => {
    // given
    const payload = faker.string.uuid();
    const token = await sut.sign(payload);

    // when
    const result = await sut.verify(token);

    // then
    expect(result.isSome()).toBeTruthy();
    expect(result.unwrap()).toEqual(payload);
  });

  it("should not to verify a token", async () => {
    // given
    const token = faker.string.sample();

    // when
    const result = await sut.verify(token);

    // then
    expect(result.isNone()).toBeTruthy();
  });
});
