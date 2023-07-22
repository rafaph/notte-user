export function toBoolean({ value }: { value?: string }): boolean {
  if (!value) {
    return false;
  }

  return ["true", "1"].includes(value.trim().toLowerCase());
}
