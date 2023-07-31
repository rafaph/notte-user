import { UserProps } from "@/domain/models";

export type UpdateUserProps = Partial<
  Omit<UserProps, "createdAt" | "updatedAt">
> &
  Pick<UserProps, "id">;

export class UpdateUserCommand {
  public constructor(public readonly userProps: UpdateUserProps) {}
}
