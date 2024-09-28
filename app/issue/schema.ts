import { createTable, generateId, lifecycleDates } from "@/db/utils"
import { organizations } from "@/organization/schema"
import { index, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

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

export const insertIssueParams = createInsertSchema(issues)
export const updateIssueParams = createSelectSchema(issues).partial().extend({
   id: z.string(),
})

export type IssueStatus = (typeof issueStatuses)[number]
export type IssueLabel = (typeof issueLabels)[number]
