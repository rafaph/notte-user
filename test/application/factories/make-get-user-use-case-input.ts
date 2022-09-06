import { faker } from "@faker-js/faker";

import { GetUserUseCaseInput } from "@/application/use-cases/get-user-use-case";

export const makeGetUserUseCaseInput = (
  input: Partial<GetUserUseCaseInput> = {},
): GetUserUseCaseInput => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...input,
});
