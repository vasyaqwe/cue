import { organizationProtectedProcedure, protectedProcedure } from "@/lib/trpc"
import {
   insertNotificationParams,
   notification,
   updateNotificationParams,
} from "@/notification/schema"
import { createServerFn } from "@tanstack/start"
import { and, count, desc, eq, inArray } from "drizzle-orm"
import { match } from "ts-pattern"
import { z } from "zod"

export const list = createServerFn(
   "GET",
   protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db.query.notification.findMany({
            where: and(
               eq(notification.organizationId, input.organizationId),
               eq(notification.receiverId, ctx.user.id),
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
      }),
)

export const unreadCount = createServerFn(
   "GET",
   protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ ctx, input }) => {
         return (
            (await ctx.db
               .select({ count: count() })
               .from(notification)
               .where(
                  and(
                     eq(notification.organizationId, input.organizationId),
                     eq(notification.receiverId, ctx.user.id),
                     eq(notification.isRead, false),
                  ),
               )
               .get()) ?? { count: 0 }
         )
      }),
)

export const insert = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(insertNotificationParams)
      .mutation(async ({ ctx, input }) => {
         const promises = input.receiverIds.map(async (receiverId) => {
            return await ctx.db
               .insert(notification)
               .values({
                  organizationId: input.organizationId,
                  issueId: input.issueId,
                  receiverId,
                  senderId: ctx.user.id,
                  type: input.type,
                  content: input.content,
                  commentId: input.commentId,
               })
               .returning()
               .get()
         })

         const result = await Promise.all(promises)

         const createdNotification = result[0]

         if (!createdNotification) return

         return {
            ...createdNotification,
            issue: input.issue,
            commentContent: input.commentContent,
         }
      }),
)

export const update = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(updateNotificationParams)
      .mutation(async ({ ctx, input }) => {
         return await ctx.db
            .update(notification)
            .set({
               isRead: input.isRead,
            })
            .where(inArray(notification.issueId, input.issueIds))
      }),
)

export const deleteFn = createServerFn(
   "POST",
   protectedProcedure
      .input(
         z.object({
            issueIds: z.array(z.string()),
            receiverIds: z.array(z.string()),
         }),
      )
      .mutation(async ({ ctx, input }) => {
         match(input.receiverIds)
            .with(
               [],
               async () =>
                  await ctx.db
                     .delete(notification)
                     .where(
                        and(
                           inArray(notification.issueId, input.issueIds),
                           eq(notification.receiverId, ctx.user.id),
                        ),
                     ),
            )
            .otherwise(
               async (receiverIds) =>
                  await ctx.db
                     .delete(notification)
                     .where(
                        and(
                           inArray(notification.receiverId, receiverIds),
                           eq(notification.type, "issue_mention"),
                        ),
                     ),
            )
      }),
)
