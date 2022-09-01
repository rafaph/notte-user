import { faker } from "@faker-js/faker";

import { NoteProps } from "@/domain/entities/note";

export const makeNoteProps = (props: Partial<NoteProps> = {}): NoteProps => ({
  id: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(),
  userId: faker.datatype.uuid(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
  ...props,
});
