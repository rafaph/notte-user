import { faker } from "@faker-js/faker";

import { GetUserRequestSchema } from "@/infra/http/request-schemas/get-user-request-schema";
import { v } from "@/lib/validator";

type Body = v.infer<typeof GetUserRequestSchema>;

export const makeGetUserRequestBody = (body: Partial<Body> = {}): Body => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...body,
});
