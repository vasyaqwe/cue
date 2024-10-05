import baseX from "base-x"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
const b58 = baseX("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")

const prefixes = {
   user: "user",
   organization: "org",
   verification_code: "vc",
   oauth_account: "oa",
   issue: "iss",
   notification: "ntf",
   comment: "com",
} as const

const generateIdBase = (prefix: keyof typeof prefixes) => {
   const buf = crypto.getRandomValues(new Uint8Array(20))

   /**
    * epoch starts more recently so that the 32-bit number space gives a
    * significantly higher useful lifetime of around 136 years
    * from 2023-11-14T22:13:20.000Z to 2159-12-22T04:41:36.000Z.
    */
   const EPOCH_TIMESTAMP = 1_700_000_000_000

   const t = Date.now() - EPOCH_TIMESTAMP

   buf[0] = (t >>> 24) & 255
   buf[1] = (t >>> 16) & 255
   buf[2] = (t >>> 8) & 255
   buf[3] = t & 255

   return `${prefixes[prefix]}_${b58.encode(buf)}` as const
}

export const generateCode = () => {
   const buf = crypto.getRandomValues(new Uint8Array(9))

   const encoded = b58.encode(buf)

   return encoded.slice(0, 12)
}

const generateId = (prefix: keyof typeof prefixes) =>
   text("id", { length: 256 })
      .primaryKey()
      .$defaultFn(() => generateIdBase(prefix))

const createTable = sqliteTable

const lifecycleDates = {
   createdAt: integer("created_at")
      .$defaultFn(() => Date.now())
      .notNull(),
   updatedAt: integer("updated_at")
      .notNull()
      .$defaultFn(() => Date.now())
      .$onUpdateFn(() => Date.now()),
}

export { createTable, lifecycleDates, generateId }
