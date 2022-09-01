import { faker } from "@faker-js/faker";

import { UserProps } from "@/domain/entities/user";

export const makeUserProps = (props: Partial<UserProps> = {}): UserProps => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
  ...props,
});
