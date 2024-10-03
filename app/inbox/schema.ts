import { createTable, generateId, lifecycleDates } from "@/db/utils"
import { issue } from "@/issue/schema"
import { organization } from "@/organization/schema"
import { user } from "@/user/schema"
import { relations } from "drizzle-orm"
import { index, integer, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const notificationTypes = ["new_issue", "issue_resolved"] as const

export const notification = createTable(
   "notification",
   {
      id: generateId("notification"),
      userId: text("user_id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      organizationId: text("organization_id")
         .notNull()
         .references(() => organization.id, { onDelete: "cascade" }),
      issueId: text("issue_id")
         .references(() => issue.id, { onDelete: "cascade" })
         .notNull(),
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
         notificationUserOrgIdx: index("notification_user_org_idx").on(
            table.userId,
            table.organizationId,
         ),
      }
   },
)

export const notificationRelations = relations(notification, ({ one }) => ({
   issue: one(issue, {
      fields: [notification.issueId],
      references: [issue.id],
   }),
   user: one(user, {
      fields: [notification.userId],
      references: [user.id],
   }),
}))

export const insertNotificationParams = createInsertSchema(notification).omit({
   id: true,
   userId: true,
   createdAt: true,
   updatedAt: true,
})
export const updateNotificationParams = createSelectSchema(notification).omit({
   content: true,
   issueId: true,
   organizationId: true,
   type: true,
   userId: true,
   createdAt: true,
   updatedAt: true,
})
