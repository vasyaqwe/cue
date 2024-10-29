import { createTable, lifecycleDates, tableId } from "@/db/utils"
import { organization } from "@/organization/schema"
import { user } from "@/user/schema"
import { relations } from "drizzle-orm"
import { index, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const issueStatuses = ["backlog", "todo", "in progress", "done"] as const
export const issueLabels = ["bug", "feature", "improvement"] as const

export const issue = createTable(
   "issue",
   {
      id: tableId("issue"),
      title: text().notNull(),
      description: text().notNull().default(""),
      status: text({
         enum: issueStatuses,
      }).notNull(),
      label: text({
         enum: issueLabels,
      }).notNull(),
      authorId: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      organizationId: text()
         .references(() => organization.id, { onDelete: "cascade" })
         .notNull(),
      ...lifecycleDates,
   },
   (table) => {
      return {
         issueOrganizationIdIdx: index("issue_organization_id_idx").on(
            table.organizationId,
         ),
         issueSearchIdx: index("issue_search_idx").on(
            table.organizationId,
            table.title,
            table.description,
         ),
      }
   },
)

export const issueRelations = relations(issue, ({ one }) => ({
   author: one(user, {
      fields: [issue.authorId],
      references: [user.id],
   }),
}))

export const insertIssueParams = createInsertSchema(issue, {
   title: z.string().min(1),
}).omit({
   id: true,
   authorId: true,
   createdAt: true,
   updatedAt: true,
})
export const updateIssueParams = createSelectSchema(issue, {
   title: z.string().min(1),
})
   .partial({
      label: true,
      status: true,
      description: true,
   })
   .omit({
      authorId: true,
      createdAt: true,
      updatedAt: true,
   })

export type IssueStatus = (typeof issueStatuses)[number]
export type IssueLabel = (typeof issueLabels)[number]
