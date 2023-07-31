import { faker } from "@faker-js/faker";
import { InternalServerErrorException } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";

import { InvalidTokenError } from "@/domain/errors";
import { JwtAuthGuard } from "@/infrastructure/http/guards";

import { ExecutionContextBuilder } from "@test/builders";
import { disableLogs } from "@test/helpers";

interface Sut {
  sut: JwtAuthGuard;
  deps: {
    queryBus: QueryBus;
  };
}

function makeSut(): Sut {
  const deps: Sut["deps"] = {
    queryBus: {
      execute: jest.fn(),
    } as unknown as QueryBus,
  };
  const sut = new JwtAuthGuard(deps.queryBus);

  disableLogs(sut);

  return { sut, deps };
}

describe(JwtAuthGuard.name, () => {
  it("should return true", async () => {
    // given
    const { sut, deps } = makeSut();
    const { queryBus } = deps;
    const executionContext = new ExecutionContextBuilder().build();
    jest
      .spyOn(queryBus, "execute")
      .mockResolvedValueOnce({ userId: faker.string.uuid() });

    // when
    const result = await sut.canActivate(executionContext);

    // then
    expect(result).toBeTruthy();
  });

  it("should return false when token is invalid", async () => {
    // given
    const { sut, deps } = makeSut();
    const { queryBus } = deps;
    const executionContext = new ExecutionContextBuilder().build();
    jest.spyOn(queryBus, "execute").mockRejectedValue(new InvalidTokenError());

    // when
    const result = await sut.canActivate(executionContext);

    // then
    expect(result).toBeFalsy();
  });

  it("should return false when no authorization header is found", async () => {
    // given
    const { sut } = makeSut();
    const executionContext = new ExecutionContextBuilder()
      .withHeaders({})
      .build();

    // when
    const result = await sut.canActivate(executionContext);

    // then
    expect(result).toBeFalsy();
  });

  it("should return false when authorization header is not a Bearer type", async () => {
    // given
    const { sut } = makeSut();
    const executionContext = new ExecutionContextBuilder()
      .withHeaders({ authorization: faker.internet.domainName() })
      .build();

    // when
    const result = await sut.canActivate(executionContext);

    // then
    expect(result).toBeFalsy();
  });

  it("should throw InternalServerErrorException", async () => {
    // given
    const { sut, deps } = makeSut();
    const { queryBus } = deps;
    const executionContext = new ExecutionContextBuilder().build();
    jest.spyOn(queryBus, "execute").mockRejectedValue(new Error());

    // when
    const resultPromise = sut.canActivate(executionContext);

    // then
    await expect(resultPromise).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
