import { InvalidEntityError } from "@/domain/errors/invalid-entity-error";

export class UserNotCreatedEvent {
  public constructor(public readonly error: InvalidEntityError) {}
}
