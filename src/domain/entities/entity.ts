import { Err, Ok, Result } from "oxide.ts";

import { InvalidEntityError } from "@/domain/errors/invalid-entity-error";
import { ValidatorType, safeParse } from "@/lib/validator";

export class Entity {
  public readonly id!: string;

  protected constructor(props: unknown) {
    Object.assign(this, props);
  }

  protected static createEntity<T extends Entity>(
    schema: ValidatorType,
    props: unknown,
  ): Result<T, InvalidEntityError> {
    const result = safeParse(schema, props);

    if (!result.success) {
      return Err(new InvalidEntityError(result.error.issues));
    }

    const entity = new this(result.data);

    return Ok(entity as T);
  }
}
