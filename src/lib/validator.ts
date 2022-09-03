/* eslint @typescript-eslint/no-explicit-any: "off" */
import {
  z as v,
  ZodError,
  ZodType as ValidatorType,
  ZodIssue as ValidatorIssue,
  SafeParseSuccess,
} from "zod";

export { ValidatorType, v, ValidatorIssue };

export interface ErrorDetail {
  [key: string]: string | ErrorDetail;
}

export class ValidatorError<T = any> extends ZodError<T> {
  public constructor(issues: ValidatorIssue[]) {
    super(issues);

    this.name = "ValidatorError";
  }

  public get detail(): ErrorDetail {
    const { issues } = this;
    const errorDetail: ErrorDetail = {};

    for (const issue of issues) {
      const size = issue.path.length;

      if (size === 0) {
        errorDetail.value = issue.message;
        continue;
      }

      if (size === 1) {
        errorDetail[issue.path[0]] = issue.message;
        continue;
      }

      let currentError: ErrorDetail = {};

      if (errorDetail[issue.path[0]]) {
        currentError = errorDetail[issue.path[0]] as ErrorDetail;
      } else {
        errorDetail[issue.path[0]] = currentError;
      }

      const paths = issue.path.slice(1);

      paths.forEach((path, index) => {
        if (index === size - 2) {
          currentError[path] = issue.message;
        } else {
          if (!currentError[path]) {
            currentError[path] = {};
          }
          currentError = currentError[path] as ErrorDetail;
        }
      });
    }

    return errorDetail;
  }
}

type SafeParseError<Input> = {
  success: false;
  error: ValidatorError<Input>;
};

type SafeParseReturnType<Input, Output> =
  | SafeParseSuccess<Output>
  | SafeParseError<Input>;

export function safeParse<T extends object>(
  schema: ValidatorType,
  data: unknown,
): SafeParseReturnType<unknown, T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    result.error = new ValidatorError(result.error.issues);
  }

  return result as SafeParseReturnType<unknown, T>;
}
