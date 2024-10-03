import { createTable, generateId, lifecycleDates } from "@/db/utils"
import { organization } from "@/organization/schema"
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
      organizationId: text("organization_id")
         .notNull()
         .references(() => organization.id, { onDelete: "cascade" }),
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

export const insertIssueParams = createInsertSchema(issue).omit({
   id: true,
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
      createdAt: true,
      updatedAt: true,
   })

export type IssueStatus = (typeof issueStatuses)[number]
export type IssueLabel = (typeof issueLabels)[number]
