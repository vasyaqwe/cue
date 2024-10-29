import { createTable, lifecycleDates, tableId } from "@/db/utils"
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
      id: tableId("user"),
      email: text().notNull().unique(),
      name: text().notNull().default("No name"),
      avatarUrl: text(),
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
      userId: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      providerId: text({
         enum: oauthProviders.options,
      }).notNull(),
      providerUserId: text().notNull().unique(),
   },
   (table) => {
      return {
         pk: primaryKey({
            name: "oauth_account_provider_user_id_unique",
            columns: [table.providerId, table.providerUserId],
         }),
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
      id: tableId("verification_code"),
      expiresAt: integer().notNull(),
      code: text().notNull(),
      userId: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      email: text().notNull().unique(),
   },
   (table) => {
      return {
         emailVerificationCodeUserIdIdx: index(
            "email_verification_code_user_id_idx",
         ).on(table.userId),
      }
   },
)

const organizationMembershipsSchema = z.array(
   z.object({ organizationId: z.string() }),
)

export const session = createTable("session", {
   id: text().primaryKey(),
   expiresAt: integer({
      mode: "timestamp",
   }).notNull(),
   userId: text()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
   organizationMemberships: text({
      mode: "json",
   })
      .$type<z.infer<typeof organizationMembershipsSchema>>()
      .notNull()
      .default([]),
})

export const selectUserParams = createSelectSchema(user)
export const selectSessionParams = createSelectSchema(session, {
   organizationMemberships: organizationMembershipsSchema,
})
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
   name: z.string().min(1).max(32),
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
