import { faker } from "@faker-js/faker";

import { VerifyTokenQueryHandler } from "@/application/handlers/queries";
import { TokenService } from "@/application/services";
import { InvalidTokenError, TokenVerificationError } from "@/domain/errors";

import { VerifyTokenQueryBuilder } from "@test/builders";
import { disableLogs } from "@test/helpers";
import { TokenServiceMock } from "@test/mocks";

interface Sut {
  sut: VerifyTokenQueryHandler;
  deps: {
    tokenService: TokenService;
  };
}

function makeSut(): Sut {
  const deps: Sut["deps"] = {
    tokenService: new TokenServiceMock(),
  };
  const sut = new VerifyTokenQueryHandler(deps.tokenService);

  disableLogs(sut);

  return { sut, deps };
}

describe(VerifyTokenQueryHandler.name, () => {
  it("should return the userId on the result", async () => {
    // given
    const { sut } = makeSut();
    const userId = faker.string.uuid();
    const query = new VerifyTokenQueryBuilder().withPayload(userId).build();

    // when
    const result = await sut.execute(query);

    // then
    expect(result).toEqual({ userId });
  });

  it("should throw InvalidTokenError", async () => {
    // given
    const { sut } = makeSut();
    const query = new VerifyTokenQueryBuilder()
      .withToken(faker.string.uuid())
      .build();

    // when
    const resultPromise = sut.execute(query);

    // then
    await expect(resultPromise).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it("should throw TokenVerificationError", async () => {
    // given
    const { sut, deps } = makeSut();
    const { tokenService } = deps;
    const query = new VerifyTokenQueryBuilder().build();
    jest.spyOn(tokenService, "verify").mockRejectedValueOnce(new Error());

    // when
    const resultPromise = sut.execute(query);

    // then
    await expect(resultPromise).rejects.toBeInstanceOf(TokenVerificationError);
  });
});
