import { v } from "@/lib/validator";

export const GetUserRequestSchema = v
  .object({
    email: v.string().trim().email(),
    password: v.string().trim(),
  })
  .strip();
