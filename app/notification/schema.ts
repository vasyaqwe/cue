import { comment } from "@/comment/schema"
import { createTable, generateId, lifecycleDates } from "@/db/utils"
import { issue, issueStatuses } from "@/issue/schema"
import { organization } from "@/organization/schema"
import { user } from "@/user/schema"
import { relations } from "drizzle-orm"
import { index, integer, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const notificationTypes = [
   "new_issue",
   "issue_resolved",
   "new_issue_comment",
   "issue_mention",
   "issue_comment_mention",
] as const

export const notification = createTable(
   "notification",
   {
      id: generateId("notification"),
      receiverId: text("receiver_id")
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      senderId: text("sender_id")
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      organizationId: text("organization_id")
         .references(() => organization.id, { onDelete: "cascade" })
         .notNull(),
      issueId: text("issue_id")
         .references(() => issue.id, { onDelete: "cascade" })
         .notNull(),
      commentId: text("comment_id").references(() => comment.id, {
         onDelete: "set null",
      }),
      type: text("type", {
         enum: notificationTypes,
      }).notNull(),
      content: text("content").notNull(), // Details about the notification
      isRead: integer("is_read", {
         mode: "boolean",
      })
         .notNull()
         .default(false),
      ...lifecycleDates,
   },
   (table) => {
      return {
         notificationReceiverIdOrgIdIdx: index(
            "notification_receiver_id_org_id_idx",
         ).on(table.receiverId, table.organizationId),
      }
   },
)

export const notificationRelations = relations(notification, ({ one }) => ({
   issue: one(issue, {
      fields: [notification.issueId],
      references: [issue.id],
   }),
   sender: one(user, {
      fields: [notification.senderId],
      references: [user.id],
   }),
}))

export const insertNotificationParams = createInsertSchema(notification)
   .omit({
      id: true,
      receiverId: true,
      senderId: true,
      createdAt: true,
      updatedAt: true,
   })
   .extend({
      issue: z.object({
         title: z.string(),
         status: z.enum(issueStatuses),
      }),
      receiverIds: z.array(z.string()),
   })
export const updateNotificationParams = createSelectSchema(notification)
   .omit({
      content: true,
      issueId: true,
      organizationId: true,
      type: true,
      receiverId: true,
      senderId: true,
      commentId: true,
      createdAt: true,
      updatedAt: true,
      id: true,
   })
   .extend({
      issueIds: z.array(z.string()),
      isRead: z.boolean().optional(),
      issue: z
         .object({
            title: z.string(),
            status: z.enum(issueStatuses),
         })
         .partial()
         .optional(),
   })
