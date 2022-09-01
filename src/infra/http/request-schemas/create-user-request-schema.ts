import { v } from "@/lib/validator";

export const CreateUserRequestSchema = v
  .object({
    email: v.string().trim().email(),
    password: v.string().trim().min(6),
    passwordConfirmation: v.string().trim(),
  })
  .strip()
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password confirmation does not match password",
    path: ["passwordConfirmation"],
  });
