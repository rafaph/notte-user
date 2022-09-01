import {
  SafeParseReturnType,
  z as v,
  ZodError,
  ZodType as ValidatorType,
  ZodIssue as ValidatorIssue,
} from "zod";

export { ValidatorType, v, ValidatorIssue };

export class ValidatorError extends ZodError {
  public constructor(issues: ValidatorIssue[]) {
    super(issues);

    this.name = "ValidatorError";
  }
}

export function safeParse<T extends object>(
  schema: ValidatorType,
  data: unknown,
): SafeParseReturnType<unknown, T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    result.error = new ValidatorError(result.error.issues);
  }

  return result;
}
