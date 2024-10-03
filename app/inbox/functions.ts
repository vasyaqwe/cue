import {
   insertNotificationParams,
   notification,
   updateNotificationParams,
} from "@/inbox/schema"
import { organizationProtectedProcedure, protectedProcedure } from "@/lib/trpc"
import { organizationMember } from "@/organization/schema"
import { createServerFn } from "@tanstack/start"
import { and, desc, eq, inArray } from "drizzle-orm"
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
                     avatarUrl: true,
                  },
               },
            },
            orderBy: [desc(notification.createdAt)],
         })
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
               })
               .returning()
               .get()
         })

         return await Promise.all(promises)
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
      .input(z.object({ notificationId: z.string() }))
      .mutation(async ({ ctx, input }) => {
         await ctx.db
            .delete(notification)
            .where(
               and(
                  eq(notification.id, input.notificationId),
                  eq(notification.receiverId, ctx.user.id),
               ),
            )
      }),
)
