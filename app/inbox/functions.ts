import {
   insertNotificationParams,
   notification,
   updateNotificationParams,
} from "@/inbox/schema"
import { organizationProtectedProcedure, protectedProcedure } from "@/lib/trpc"
import { organizationMember } from "@/organization/schema"
import { createServerFn } from "@tanstack/start"
import { and, count, desc, eq, inArray } from "drizzle-orm"
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
         const members = await ctx.db.query.organizationMember.findMany({
            where: eq(organizationMember.organizationId, input.organizationId),
            columns: {
               id: true,
            },
         })
         const filteredMembers = members.filter(
            (member) => member.id !== ctx.user.id,
         )

         const promises = filteredMembers.map(async (member) => {
            return await ctx.db
               .insert(notification)
               .values({
                  organizationId: input.organizationId,
                  issueId: input.issueId,
                  receiverId: member.id,
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

         return { ...createdNotification, issue: input.issue }
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
            .where(inArray(notification.id, input.ids))
      }),
)

export const deleteFn = createServerFn(
   "POST",
   protectedProcedure
      .input(z.object({ notificationIds: z.array(z.string()) }))
      .mutation(async ({ ctx, input }) => {
         await ctx.db
            .delete(notification)
            .where(
               and(
                  inArray(notification.id, input.notificationIds),
                  eq(notification.receiverId, ctx.user.id),
               ),
            )
      }),
)
