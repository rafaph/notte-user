export interface CredentialsProps {
  id: string;
  email: string;
  password: string;
}

export type WritableCredentialsProps = Omit<CredentialsProps, "id">;

export class Credentials implements CredentialsProps {
  public readonly id: string;
  public readonly email: string;
  public readonly password: string;

  public constructor(props: CredentialsProps) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
  }
}
