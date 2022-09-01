import { faker } from "@faker-js/faker";

import { CreateUserRequestSchema } from "@/infra/http/request-schemas/create-user-request-schema";
import { v } from "@/lib/validator";

type Body = v.infer<typeof CreateUserRequestSchema>;

export const makeCreateUserRequestBody = (body: Partial<Body> = {}): Body => {
  const password = body.password ?? faker.internet.password();
  const passwordConfirmation = body.passwordConfirmation ?? password;

  return {
    email: faker.internet.email(),
    password,
    passwordConfirmation,
    ...body,
  };
};
