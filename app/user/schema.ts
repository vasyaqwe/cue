import { createTable, generateId, lifecycleDates } from "@/db/utils"
import { relations } from "drizzle-orm"
import {
   index,
   integer,
   primaryKey,
   text,
   uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const user = createTable(
   "user",
   {
      id: generateId("user"),
      email: text("email").notNull().unique(),
      name: text("name").notNull().default("No name"),
      avatarUrl: text("avatar_url"),
      ...lifecycleDates,
   },
   (table) => {
      return {
         userEmailIdx: uniqueIndex("user_email_idx").on(table.email),
      }
   },
)

export const oauthProviders = z.enum(["github", "google"])

export const oauthAccount = createTable(
   "oauth_account",
   {
      userId: text("user_id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      providerId: text("provider_id", {
         enum: oauthProviders.options,
      }).notNull(),
      providerUserId: text("provider_user_id").notNull().unique(),
   },
   (table) => {
      return {
         pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
      }
   },
)

export const userRelations = relations(user, ({ many }) => ({
   oauthAccount: many(oauthAccount),
}))

export const oauthAccountRelations = relations(oauthAccount, ({ one }) => ({
   user: one(user, {
      fields: [oauthAccount.userId],
      references: [user.id],
   }),
}))

export const emailVerificationCode = createTable(
   "email_verification_code",
   {
      id: generateId("verification_code"),
      expiresAt: integer("expires_at").notNull(),
      code: text("code").notNull(),
      userId: text("user_id")
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      email: text("email").notNull().unique(),
   },
   (table) => {
      return {
         emailVerificationCodeUserIdIdx: index(
            "email_verification_code_user_id_idx",
         ).on(table.userId),
      }
   },
)

export const session = createTable("session", {
   id: text("id").primaryKey(),
   expiresAt: integer("expires_at", {
      mode: "timestamp",
   }).notNull(),
   userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
})

export const selectUserParams = createSelectSchema(user)
export const selectSessionParams = createSelectSchema(session)
export const insertUserParams = z
   .object({
      email: z.string().email(),
   })
   .extend({
      referralCode: z.string().optional(),
   })

export const insertOauthAccountParams = createInsertSchema(oauthAccount, {
   providerUserId: z.string().min(1),
}).omit({
   userId: true,
})

export const updateUserParams = createSelectSchema(user, {
   name: z.string().min(1),
}).partial()

export const verifyLoginCodeParams = createInsertSchema(
   emailVerificationCode,
).pick({
   code: true,
   userId: true,
})

export type User = z.infer<typeof selectUserParams>
export type Session = z.infer<typeof selectSessionParams>
export type OauthProvider = z.infer<typeof oauthProviders>
