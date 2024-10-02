import {
   insertNotificationParams,
   notifications,
   updateNotificationParams,
} from "@/inbox/schema"
import { organizationProtectedProcedure, protectedProcedure } from "@/lib/trpc"
import { organizationMembers } from "@/organization/schema"
import { createServerFn } from "@tanstack/start"
import { and, desc, eq } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn(
   "GET",
   protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db.query.notifications.findMany({
            where: and(
               eq(notifications.organizationId, input.organizationId),
               eq(notifications.userId, ctx.user.id),
            ),
            with: {
               issue: {
                  columns: {
                     id: true,
                     title: true,
                     status: true,
                  },
               },
               user: {
                  columns: {
                     id: true,
                     avatarUrl: true,
                  },
               },
            },
            orderBy: [desc(notifications.createdAt)],
         })
      }),
)

export const insert = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(insertNotificationParams)
      .mutation(async ({ ctx, input }) => {
         const members = await ctx.db.query.organizationMembers.findMany({
            where: eq(organizationMembers.organizationId, input.organizationId),
            columns: {
               id: true,
            },
         })
         const filteredMembers = members.filter(
            (member) => member.id !== ctx.user.id,
         )

         const promises = filteredMembers.map(async (member) => {
            return await ctx.db
               .insert(notifications)
               .values({
                  organizationId: input.organizationId,
                  issueId: input.issueId,
                  userId: member.id,
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
            .update(notifications)
            .set({
               isRead: input.isRead,
            })
            .where(eq(notifications.id, input.id))
      }),
)

export const deleteFn = createServerFn(
   "POST",
   protectedProcedure
      .input(z.object({ issueId: z.string() }))
      .mutation(async ({ ctx, input }) => {
         await ctx.db
            .delete(notifications)
            .where(
               and(
                  eq(notifications.id, input.issueId),
                  eq(notifications.userId, ctx.user.id),
               ),
            )
      }),
)
