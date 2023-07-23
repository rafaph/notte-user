export type InterfaceOf<T> = {
  -readonly [P in keyof T]: T[P];
};
