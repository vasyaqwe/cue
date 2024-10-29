import { env } from "@/env"
import type { Config } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import * as schema from "./schema"

const options = {
   local: { url: "file:db.sqlite" },
   remote: {
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
   },
   "local-replica": {
      url: "file:db.sqlite",
      syncUrl: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
   },
} satisfies Record<typeof env.DATABASE_CONNECTION_TYPE, Config>

export const db = drizzle({
   connection: options[env.DATABASE_CONNECTION_TYPE],
   casing: "snake_case",
   schema,
})
export type Database = typeof db
