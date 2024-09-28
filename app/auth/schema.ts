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

export const users = createTable(
   "users",
   {
      id: generateId("user"),
      email: text("email").notNull().unique(),
      name: text("name"),
      avatarUrl: text("avatar_url"),
      onboardingCompleted: integer("onboarding_completed", {
         mode: "boolean",
      })
         .notNull()
         .default(false),
      ...lifecycleDates,
   },
   (table) => {
      return {
         usersEmailIdx: uniqueIndex("users_email_idx").on(table.email),
      }
   },
)

export const oauthProviders = z.enum(["github"])

export const oauthAccounts = createTable(
   "oauth_accounts",
   {
      userId: text("user_id")
         .notNull()
         .references(() => users.id, { onDelete: "cascade" }),
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

export const usersRelations = relations(users, ({ many }) => ({
   oauthAccounts: many(oauthAccounts),
}))

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
   user: one(users, {
      fields: [oauthAccounts.userId],
      references: [users.id],
   }),
}))

export const emailVerificationCodes = createTable(
   "email_verification_codes",
   {
      id: generateId("verification_code"),
      expiresAt: integer("expires_at").notNull(),
      code: text("code").notNull(),
      userId: text("user_id").notNull(),
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

export const sessions = createTable("sessions", {
   id: text("id").primaryKey(),
   expiresAt: integer("expires_at", {
      mode: "timestamp",
   }).notNull(),
   userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
})

export const selectUserParams = createSelectSchema(users)
export const selectSessionParams = createSelectSchema(sessions)
export const insertUserParams = z
   .object({
      email: z.string().email(),
   })
   .extend({
      referralCode: z.string().optional(),
   })

export const insertOauthAccountParams = createInsertSchema(oauthAccounts, {
   providerUserId: z.string().min(1),
}).omit({
   userId: true,
})

export const updateUserParams = createSelectSchema(users, {
   name: z.string().min(1),
}).partial()

export const verifyLoginCodeParams = createInsertSchema(
   emailVerificationCodes,
).pick({
   code: true,
   userId: true,
})

export type User = z.infer<typeof selectUserParams>
export type Session = z.infer<typeof selectSessionParams>
export type OauthProvider = z.infer<typeof oauthProviders>
