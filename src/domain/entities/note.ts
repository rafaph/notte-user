import { Result } from "oxide.ts";

import { Entity } from "@/domain/entities/entity";
import { InvalidEntityError } from "@/domain/errors/invalid-entity-error";
import { v } from "@/lib/validator";

export const NoteSchema = v
  .object({
    id: v.string().uuid(),
    title: v.string().trim().min(1),
    content: v.string().trim(),
    userId: v.string().uuid(),
    createdAt: v.date().max(new Date()),
    updatedAt: v.date().max(new Date()),
  })
  .strip();

export type NoteProps = v.infer<typeof NoteSchema>;

export class Note extends Entity {
  public readonly title!: string;
  public readonly content!: string;
  public readonly userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static create(props: NoteProps): Result<Note, InvalidEntityError> {
    return this.createEntity<Note>(NoteSchema, props);
  }
}
