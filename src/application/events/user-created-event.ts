import { UserProps } from "@/domain/entities/user";

export class UserCreatedEvent {
  public constructor(public readonly data: Pick<UserProps, "id">) {}
}
