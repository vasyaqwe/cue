import {
   insertNotificationParams,
   notification,
   updateNotificationParams,
} from "@/notification/schema"
import { organizationMemberMiddleware } from "@/organization/middleware"
import { authMiddleware } from "@/user/middleware"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { and, count, desc, eq, inArray } from "drizzle-orm"
import { match } from "ts-pattern"
import { z } from "zod"

export const list = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .validator(zodValidator(z.object({ organizationId: z.string() })))
   .handler(async ({ context, data }) => {
      return await context.db.query.notification.findMany({
         where: and(
            eq(notification.organizationId, data.organizationId),
            eq(notification.receiverId, context.user.id),
         ),
         columns: {
            id: true,
            type: true,
            content: true,
            commentId: true,
            issueId: true,
            isRead: true,
            createdAt: true,
         },
         with: {
            issue: {
               columns: {
                  title: true,
                  status: true,
               },
            },
            sender: {
               columns: {
                  id: true,
                  name: true,
                  avatarUrl: true,
               },
            },
         },
         orderBy: [desc(notification.createdAt)],
      })
   })

export const unreadCount = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .validator(zodValidator(z.object({ organizationId: z.string() })))
   .handler(async ({ context, data }) => {
      return (
         (await context.db
            .select({ count: count() })
            .from(notification)
            .where(
               and(
                  eq(notification.organizationId, data.organizationId),
                  eq(notification.receiverId, context.user.id),
                  eq(notification.isRead, false),
               ),
            )
            .get()) ?? { count: 0 }
      )
   })

export const insert = createServerFn({ method: "POST" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(insertNotificationParams))
   .handler(async ({ context, data }) => {
      const promises = data.receiverIds.map(async (receiverId) => {
         return await context.db
            .insert(notification)
            .values({
               organizationId: data.organizationId,
               issueId: data.issueId,
               receiverId,
               senderId: context.user.id,
               type: data.type,
               content: data.content,
               commentId: data.commentId,
            })
            .returning()
            .get()
      })

      const result = await Promise.all(promises)

      const createdNotification = result[0]

      if (!createdNotification) return

      return {
         ...createdNotification,
         issue: data.issue,
         commentContent: data.commentContent,
      }
   })

export const update = createServerFn({ method: "POST" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(updateNotificationParams))
   .handler(async ({ context, data }) => {
      await context.db
         .update(notification)
         .set({
            isRead: data.isRead,
         })
         .where(inArray(notification.issueId, data.issueIds))
   })

export const deleteFn = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(
      zodValidator(
         z.object({
            issueIds: z.array(z.string()),
            receiverIds: z.array(z.string()),
         }),
      ),
   )
   .handler(async ({ context, data }) => {
      match(data.receiverIds)
         .with(
            [],
            async () =>
               await context.db
                  .delete(notification)
                  .where(
                     and(
                        inArray(notification.issueId, data.issueIds),
                        eq(notification.receiverId, context.user.id),
                     ),
                  ),
         )
         .otherwise(
            async (receiverIds) =>
               await context.db
                  .delete(notification)
                  .where(
                     and(
                        inArray(notification.receiverId, receiverIds),
                        eq(notification.type, "issue_mention"),
                     ),
                  ),
         )
   })
