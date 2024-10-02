import { createTable, generateId, lifecycleDates } from "@/db/utils"
import { issues } from "@/issue/schema"
import { organizations } from "@/organization/schema"
import { users } from "@/user/schema"
import { relations } from "drizzle-orm"
import { index, integer, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const notificationTypes = ["new_issue", "issue_resolved"] as const

export const notifications = createTable(
   "notifications",
   {
      id: generateId("notification"),
      userId: text("user_id")
         .notNull()
         .references(() => users.id, { onDelete: "cascade" }),
      organizationId: text("organization_id")
         .notNull()
         .references(() => organizations.id, { onDelete: "cascade" }),
      issueId: text("issue_id")
         .references(() => issues.id, { onDelete: "cascade" })
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
         notificationsUserOrgIdx: index("notifications_user_org_idx").on(
            table.userId,
            table.organizationId,
         ),
      }
   },
)

export const notificationsRelations = relations(notifications, ({ one }) => ({
   issue: one(issues, {
      fields: [notifications.issueId],
      references: [issues.id],
   }),
   user: one(users, {
      fields: [notifications.userId],
      references: [users.id],
   }),
}))

export const insertNotificationParams = createInsertSchema(notifications).omit({
   id: true,
   userId: true,
   createdAt: true,
   updatedAt: true,
})
export const updateNotificationParams = createSelectSchema(notifications).omit({
   content: true,
   issueId: true,
   organizationId: true,
   type: true,
   userId: true,
   createdAt: true,
   updatedAt: true,
})
