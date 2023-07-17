import { WritableUserProps } from "@/user/domain/models";

export class CreateUserCommand {
  public constructor(public readonly userProps: WritableUserProps) {}
}
