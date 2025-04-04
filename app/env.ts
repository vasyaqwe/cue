import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"
export const env = createEnv({
   server: {
      NODE_ENV: z
         .enum(["development", "test", "production"])
         .default("development"),
      DATABASE_URL: z.string().min(1),
      DATABASE_CONNECTION_TYPE: z
         .enum(["local", "remote", "local-replica"])
         .default("local"),
      DATABASE_AUTH_TOKEN: z
         .string()
         .optional()
         .refine((s) => {
            // not needed for local only
            const type = process.env.DATABASE_CONNECTION_TYPE
            return type === "remote" || type === "local-replica"
               ? s && s.length > 0
               : true
         }),
      GITHUB_CLIENT_ID: z.string().min(1),
      GITHUB_CLIENT_SECRET: z.string().min(1),
      GOOGLE_CLIENT_ID: z.string().min(1),
      GOOGLE_CLIENT_SECRET: z.string().min(1),
      STORAGE_READ_WRITE_TOKEN: z.string().min(1),
   },

   /**
    * The prefix that client-side variables must have. This is enforced both at
    * a type-level and at runtime.
    */
   clientPrefix: "VITE_",

   client: {
      VITE_PARTYKIT_URL: z.string().min(1),
      VITE_BASE_URL: z.string().min(1),
   },

   /**
    * What object holds the environment variables at runtime. This is usually
    * `process.env` or `import.meta.env`.
    */
   runtimeEnv: {
      ...process.env,
      VITE_BASE_URL:
         process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://cue.vasyaqwe.com",
      VITE_PARTYKIT_URL: "cue.vasyaqwe.partykit.dev",
   },

   /**
    * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
    * useful for Docker builds.
    */
   skipValidation: !!process.env.SKIP_ENV_VALIDATION,

   /**
    * By default, this library will feed the environment variables directly to
    * the Zod validator.
    *
    * This means that if you have an empty string for a value that is supposed
    * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
    * it as a type mismatch violation. Additionally, if you have an empty string
    * for a value that is supposed to be a string with a default value (e.g.
    * `DOMAIN=` in an ".env" file), the default value will never be applied.
    *
    * In order to solve these issues, we recommend that all new projects
    * explicitly specify this option as true.
    */
   emptyStringAsUndefined: true,
})
