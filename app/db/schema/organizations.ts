import { users } from "@/db/schema/users"
import { relations } from "drizzle-orm"
import { index, primaryKey, text, uniqueIndex } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"
import { createTable, generateId, lifecycleDates } from "../utils"

export const organizations = createTable(
   "organizations",
   {
      id: generateId("organization"),
      name: text("name").notNull(),
      slug: text("slug").notNull().unique(),
      ...lifecycleDates,
   },
   (table) => {
      return {
         organizationsSlugIdx: uniqueIndex("organizations_slug_idx").on(
            table.slug,
         ),
      }
   },
)

export const organizationMembers = createTable(
   "organization_members",
   {
      id: text("id")
         .notNull()
         .references(() => users.id, { onDelete: "cascade" }),
      organizationId: text("organization_id")
         .notNull()
         .references(() => organizations.id, { onDelete: "cascade" }),
   },
   (table) => {
      return {
         organizationMembersOrganizationIdIdx: index(
            "organization_members_organization_id_idx",
         ).on(table.organizationId),
         pk: primaryKey({ columns: [table.id, table.organizationId] }),
      }
   },
)

export const organizationMembersRelations = relations(
   organizationMembers,
   ({ one }) => ({
      organization: one(organizations, {
         fields: [organizationMembers.organizationId],
         references: [organizations.id],
      }),
      user: one(users, {
         fields: [organizationMembers.id],
         references: [users.id],
      }),
   }),
)

export const insertOrganizationParams = createInsertSchema(organizations)
