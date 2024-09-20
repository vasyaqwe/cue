import { env } from "@/env"
import type { Config } from "drizzle-kit"

export default {
   schema: "./app/db/schema/index.ts",
   out: "./app/db/migrations",
   dialect: "sqlite",
   driver: "turso",
   dbCredentials: {
      url: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
   },
   verbose: true,
} satisfies Config
