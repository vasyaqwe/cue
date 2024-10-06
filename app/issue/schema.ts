import { createTable, generateId, lifecycleDates } from "@/db/utils"
import { organization } from "@/organization/schema"
import { user } from "@/user/schema"
import { relations } from "drizzle-orm"
import { index, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const issueStatuses = ["backlog", "todo", "in progress", "done"] as const
export const issueLabels = ["bug", "feature", "improvement"] as const

export const issue = createTable(
   "issue",
   {
      id: generateId("issue"),
      title: text("title").notNull(),
      description: text("description").notNull().default(""),
      status: text("status", {
         enum: issueStatuses,
      }).notNull(),
      label: text("label", {
         enum: issueLabels,
      }).notNull(),
      authorId: text("author_id")
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      organizationId: text("organization_id")
         .references(() => organization.id, { onDelete: "cascade" })
         .notNull(),
      ...lifecycleDates,
   },
   (table) => {
      return {
         issueOrganizationIdIdx: index("issue_organization_id_idx").on(
            table.organizationId,
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

export const insertIssueParams = createInsertSchema(issue).omit({
   id: true,
   authorId: true,
   createdAt: true,
   updatedAt: true,
})
export const updateIssueParams = createSelectSchema(issue)
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
