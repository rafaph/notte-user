import { Result } from "oxide.ts";

import { Entity } from "@/domain/entities/entity";
import { InvalidEntityError } from "@/domain/errors/invalid-entity-error";
import { v } from "@/lib/validator";

export const UserSchema = v
  .object({
    id: v.string().uuid(),
    email: v.string().trim().email(),
    password: v.string().trim().min(6),
    createdAt: v.date(),
    updatedAt: v.date(),
  })
  .strip();

export type UserProps = v.infer<typeof UserSchema>;

export class User extends Entity {
  public readonly email!: string;
  public readonly password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static create(props: UserProps): Result<User, InvalidEntityError> {
    return this.createEntity<User>(UserSchema, props);
  }
}
