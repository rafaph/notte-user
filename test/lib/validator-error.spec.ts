import { faker } from "@faker-js/faker";

import { CreateUserRequestSchema } from "@/infra/http/request-schemas/create-user-request-schema";
import { ErrorDetail, safeParse, v, ValidatorError } from "@/lib/validator";

describe(ValidatorError.name, () => {
  const schema = v
    .object({
      field1: v.string().min(1).max(5),
      field2: v
        .object({
          field1: v.string().min(1).max(5),
        })
        .strip(),
    })
    .strip();
  const data = [
    {
      input: {
        field1: faker.datatype.boolean(),
        field2: {
          field1: faker.datatype.boolean(),
        },
      },
      verify: (result: ErrorDetail) =>
        !!(
          result.field1 &&
          result.field2 &&
          (result.field2 as ErrorDetail).field1
        ),
    },
    {
      input: {
        field1: faker.datatype.number({ min: 1, max: 1000 }).toString(10),
      },
      verify: (result: ErrorDetail) => !!result.field2,
    },
  ];

  data.forEach(({ input, verify }, index) => {
    it(`should build the error detail ${index}`, () => {
      // given/when
      const result = safeParse(schema, input);
      // then
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(verify(result.error.detail)).to.be.true;
      }
    });
  });

  it("should return an error for refine", () => {
    // given
    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      passwordConfirmation: faker.internet.password(),
    };
    // when
    const result = safeParse(CreateUserRequestSchema, input);
    // then
    expect(result.success).to.be.false;
    if (!result.success) {
      const { detail } = result.error;
      expect(detail.passwordConfirmation).to.be.a("string");
    }
  });

  it("should return an error for non object", () => {
    // given
    const schema = v.string().email();
    const input = faker.internet.password();
    // when
    const result = safeParse(schema, input);
    // then
    expect(result.success).to.be.false;
    if (!result.success) {
      const { detail } = result.error;
      expect(detail.value).to.be.a("string");
    }
  });
});
