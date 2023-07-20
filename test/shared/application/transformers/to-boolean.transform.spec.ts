import { faker } from "@faker-js/faker";

import { toBoolean } from "@/shared/application/transformers";

describe("to-boolean.transform", () => {
  test.each([
    { value: undefined, expected: false, text: "undefined" },
    { value: faker.person.firstName(), expected: false, text: "not truthy" },
    { value: "1", expected: true, text: "1" },
    { value: "tRuE", expected: true, text: "tRuE" },
    { value: "true", expected: true, text: "true" },
  ])('should return $expected when value is "$text"', ({ value, expected }) => {
    // given/when
    const result = toBoolean({ value });

    // then
    expect(result).toBe(expected);
  });
});
