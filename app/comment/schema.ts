import { createTable, lifecycleDates, tableId } from "@/db/utils"
import { issue } from "@/issue/schema"
import { organization } from "@/organization/schema"
import { user } from "@/user/schema"
import { relations } from "drizzle-orm"
import { index, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const comment = createTable(
   "comment",
   {
      id: tableId("comment"),
      content: text().notNull().default(""),
      organizationId: text()
         .references(() => organization.id, { onDelete: "cascade" })
         .notNull(),
      authorId: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      resolvedById: text().references(() => user.id, {
         onDelete: "cascade",
      }),
      issueId: text()
         .references(() => issue.id, { onDelete: "cascade" })
         .notNull(),
      ...lifecycleDates,
   },
   (table) => {
      return {
         commentIssueIdIdx: index("comment_issue_id_idx").on(table.issueId),
         commentSearchIdx: index("comment_search_idx").on(
            table.issueId,
            table.content,
         ),
      }
   },
)

export const commentRelations = relations(comment, ({ one }) => ({
   author: one(user, {
      fields: [comment.authorId],
      references: [user.id],
   }),
   resolvedBy: one(user, {
      fields: [comment.resolvedById],
      references: [user.id],
   }),
}))

export const updateCommentParams = createSelectSchema(comment)
   .partial({
      resolvedById: true,
      content: true,
   })
   .omit({
      authorId: true,
      createdAt: true,
      updatedAt: true,
   })

export const insertCommentParams = createInsertSchema(comment).omit({
   id: true,
   createdAt: true,
   updatedAt: true,
})
