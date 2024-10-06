import { createTable, generateId, lifecycleDates } from "@/db/utils"
import { issue } from "@/issue/schema"
import { organization } from "@/organization/schema"
import { user } from "@/user/schema"
import { relations } from "drizzle-orm"
import { index, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"

export const comment = createTable(
   "comment",
   {
      id: generateId("comment"),
      content: text("content").notNull().default(""),
      organizationId: text("organization_id")
         .notNull()
         .references(() => organization.id, { onDelete: "cascade" }),
      authorId: text("author_id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      resolvedById: text("resolved_by_id").references(() => user.id, {
         onDelete: "cascade",
      }),
      issueId: text("issue_id")
         .notNull()
         .references(() => issue.id, { onDelete: "cascade" }),
      ...lifecycleDates,
   },
   (table) => {
      return {
         commentIssueIdIdx: index("comment_issue_id_idx").on(table.issueId),
      }
   },
)

export const commentRelations = relations(comment, ({ one }) => ({
   author: one(user, {
      fields: [comment.authorId],
      references: [user.id],
   }),
}))

export const insertCommentParams = createInsertSchema(comment).omit({
   id: true,
   createdAt: true,
   updatedAt: true,
})
