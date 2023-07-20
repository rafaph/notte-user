import { randomUUID } from "crypto";

import { setMilliseconds } from "date-fns";

export interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WritableUserProps = Omit<
  UserProps,
  "id" | "createdAt" | "updatedAt"
>;

export class User implements UserProps {
  public readonly id: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly password: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(props: UserProps) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.password = props.password;
    this.updatedAt = setMilliseconds(props.updatedAt, 0);
    this.createdAt = setMilliseconds(props.createdAt, 0);
  }

  public update(props: WritableUserProps): void {
    Object.assign(this, {
      ...props,
      updatedAt: setMilliseconds(new Date(), 0),
    });
  }

  public static new(props: WritableUserProps): User {
    const now = new Date();

    return new User({
      ...props,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }
}
