import { env } from "@/env"
import type { Config } from "drizzle-kit"

export default {
   schema: "./app/db/schema/index.ts",
   out: "./app/db/migrations",
   dialect: "turso",
   casing: "snake_case",
   dbCredentials: {
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
   },
   verbose: true,
} satisfies Config
