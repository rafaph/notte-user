import { faker } from "@faker-js/faker";

import { toInt } from "@/application/transformers";

const cases = Array.from({ length: 10 }, () => {
  const value = faker.number.int({ min: 1, max: 100000 });
  return {
    value: value.toString(10),
    expected: value,
  };
});

describe("to-int.transform", () => {
  test.each(cases)(
    'should return $expected when value is "$value"',
    ({ value, expected }) => {
      // given/when
      const result = toInt({ value });

      // then
      expect(result).toEqual(expected);
    },
  );
});
