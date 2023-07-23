import { UserProps } from "@/domain/models";

export type UpdateUserProps = Omit<UserProps, "createdAt" | "updatedAt">;

export class UpdateUserCommand {
  public constructor(public readonly userProps: UpdateUserProps) {}
}
