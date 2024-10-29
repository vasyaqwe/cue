import { createTable, generateCode, lifecycleDates, tableId } from "@/db/utils"
import { user } from "@/user/schema"
import { relations } from "drizzle-orm"
import { index, primaryKey, text, uniqueIndex } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

export const organization = createTable(
   "organization",
   {
      id: tableId("organization"),
      name: text().notNull(),
      slug: text().notNull().unique(),
      inviteCode: text().notNull().$defaultFn(generateCode),
      ...lifecycleDates,
   },
   (table) => {
      return {
         organizationSlugIdx: uniqueIndex("organization_slug_idx").on(
            table.slug,
         ),
      }
   },
)

export const organizationMember = createTable(
   "organization_member",
   {
      id: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      organizationId: text()
         .references(() => organization.id, { onDelete: "cascade" })
         .notNull(),
   },
   (table) => {
      return {
         organizationMemberOrganizationIdIdx: index(
            "organization_member_organization_id_idx",
         ).on(table.organizationId),
         pk: primaryKey({ columns: [table.id, table.organizationId] }),
      }
   },
)

export const organizationMemberRelations = relations(
   organizationMember,
   ({ one }) => ({
      organization: one(organization, {
         fields: [organizationMember.organizationId],
         references: [organization.id],
      }),
      user: one(user, {
         fields: [organizationMember.id],
         references: [user.id],
      }),
   }),
)

export const insertOrganizationParams = createInsertSchema(organization, {
   name: z.string().min(1).max(32),
}).omit({
   id: true,
   createdAt: true,
   updatedAt: true,
})
