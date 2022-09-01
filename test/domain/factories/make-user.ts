import { User, UserProps } from "@/domain/entities/user";

import { makeUserProps } from "@test/domain/factories/make-user-props";

export const makeUser = (props: Partial<UserProps> = {}): User => {
  const userProps = makeUserProps(props);
  const result = User.create(userProps);

  if (result.isErr()) {
    throw result.unwrapErr();
  }

  return result.unwrap();
};
