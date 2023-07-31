import { WritableUserProps } from "@/domain/models";

export class CreateUserCommand {
  public constructor(public readonly userProps: WritableUserProps) {}
}
