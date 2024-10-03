import {
   createTable,
   generateCode,
   generateId,
   lifecycleDates,
} from "@/db/utils"
import { user } from "@/user/schema"
import { relations } from "drizzle-orm"
import { index, primaryKey, text, uniqueIndex } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"

export const organization = createTable(
   "organization",
   {
      id: generateId("organization"),
      name: text("name").notNull(),
      slug: text("slug").notNull().unique(),
      inviteCode: text("invite_code").notNull().$defaultFn(generateCode),
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
      id: text("id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      organizationId: text("organization_id")
         .notNull()
         .references(() => organization.id, { onDelete: "cascade" }),
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

export const insertOrganizationParams = createInsertSchema(organization).omit({
   id: true,
   createdAt: true,
   updatedAt: true,
})
