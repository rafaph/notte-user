import { faker } from "@faker-js/faker";

import { Note } from "@/domain/entities/note";
import { InvalidEntityError } from "@/domain/errors/invalid-entity-error";

import { makeNoteProps } from "@test/domain/factories/make-note-props";

describe(Note.name, () => {
  it("should return an Ok when note props is correct", () => {
    // given
    const props = makeNoteProps();
    // when
    const result = Note.create(props);
    // then
    expect(result.isOk()).to.be.true;
    expect(result.unwrap()).to.be.an.instanceof(Note);
  });

  it("should throw an Err when note props is not correct", () => {
    // given
    const props = makeNoteProps({
      id: faker.word.adverb(),
    });
    // when
    const result = Note.create(props);
    // then
    expect(result.isErr()).to.be.true;
    expect(result.unwrapErr()).to.be.an.instanceof(InvalidEntityError);
  });
});
