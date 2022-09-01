import { ValidatorError, ValidatorIssue } from "@/lib/validator";

export class InvalidEntityError extends ValidatorError {
  public constructor(issues: ValidatorIssue[]) {
    super(issues);

    this.name = "InvalidEntityError";
  }
}
