import { faker } from "@faker-js/faker";

import { DeleteUserCommand } from "@/application/commands";
import { DeleteUserCommandHandler } from "@/application/handlers/commands";
import { UserDeleteError } from "@/domain/errors";
import { DeleteUserRepository } from "@/domain/repositories";

import { disableLogs } from "@test/helpers";
import { DeleteUserRepositoryMock } from "@test/mocks";

interface Sut {
  sut: DeleteUserCommandHandler;
  deps: {
    deleteUserRepository: DeleteUserRepository;
  };
}

function makeSut(): Sut {
  const deps: Sut["deps"] = {
    deleteUserRepository: new DeleteUserRepositoryMock(),
  };
  const sut = new DeleteUserCommandHandler(deps.deleteUserRepository);

  disableLogs(sut);

  return { sut, deps };
}

describe(DeleteUserCommandHandler.name, () => {
  it("should delete an user", async () => {
    // given
    const { sut } = makeSut();
    const userId = faker.string.uuid();
    const command = new DeleteUserCommand(userId);

    // when
    const resultPromise = sut.execute(command);

    // then
    await expect(resultPromise).resolves.toBeUndefined();
  });

  it("should throw an UserDeleteError", async () => {
    // given
    const { sut, deps } = makeSut();
    const { deleteUserRepository } = deps;
    const userId = faker.string.uuid();
    const command = new DeleteUserCommand(userId);
    jest
      .spyOn(deleteUserRepository, "delete")
      .mockRejectedValueOnce(new Error());

    // when
    const resultPromise = sut.execute(command);

    // then
    await expect(resultPromise).rejects.toBeInstanceOf(UserDeleteError);
  });
});
