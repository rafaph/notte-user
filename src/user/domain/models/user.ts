import { randomUUID } from "crypto";

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

export class User {
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
    this.updatedAt = props.updatedAt;
    this.createdAt = props.createdAt;
  }

  public update(props: WritableUserProps): void {
    Object.assign(this, {
      ...props,
      updatedAt: new Date(),
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
