import { createTable, generateId, lifecycleDates } from "@/db/utils"
import { organizations } from "@/organization/schema"
import { index, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const issueStatuses = ["backlog", "todo", "in progress", "done"] as const
export const issueLabels = ["bug", "feature", "improvement"] as const

export const issues = createTable(
   "issues",
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
         .references(() => organizations.id, { onDelete: "cascade" }),
      ...lifecycleDates,
   },
   (table) => {
      return {
         issuesOrganizationIdIdx: index("issues_organization_id_idx").on(
            table.organizationId,
         ),
      }
   },
)

export const insertIssueParams = createInsertSchema(issues).omit({
   id: true,
   createdAt: true,
   updatedAt: true,
})
export const updateIssueParams = createSelectSchema(issues)
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
