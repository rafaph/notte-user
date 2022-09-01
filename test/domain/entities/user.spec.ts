import { faker } from "@faker-js/faker";

import { User } from "@/domain/entities/user";
import { InvalidEntityError } from "@/domain/errors/invalid-entity-error";

import { makeUserProps } from "@test/domain/factories/make-user-props";

describe(User.name, () => {
  it("should return an Ok when user props is correct", () => {
    // given
    const props = makeUserProps();
    // when
    const result = User.create(props);
    // then
    expect(result.isOk()).to.be.true;
    expect(result.unwrap()).to.be.an.instanceof(User);
  });

  it("should throw an Err when user props is not correct", () => {
    // given
    const props = makeUserProps({
      id: faker.word.adverb(),
    });
    // when
    const result = User.create(props);
    // then
    expect(result.isErr()).to.be.true;
    expect(result.unwrapErr()).to.be.an.instanceof(InvalidEntityError);
  });
});
