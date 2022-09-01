import { v } from "@/lib/validator";

export const ConfigSchema = v
  .object({
    env: v.enum(["development", "production", "test"]),
    port: v.number(),
    host: v.string(),
    db: v
      .object({
        url: v.string().url(),
        pool: v.object({
          min: v.number(),
          max: v.number(),
        }),
      })
      .strict(),
  })
  .strict();

export type ConfigType = v.infer<typeof ConfigSchema>;
