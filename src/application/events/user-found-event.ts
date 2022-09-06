import { UserProps } from "@/domain/entities/user";

export class UserFoundEvent {
  public constructor(public readonly data: Pick<UserProps, "id">) {}
}
