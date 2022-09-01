import { faker } from "@faker-js/faker";

import { CreateUserUseCaseInput } from "@/application/use-cases/create-user-use-case";

export const makeCreateUserUseCaseInput = (
  input: Partial<CreateUserUseCaseInput> = {},
): CreateUserUseCaseInput => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...input,
});
