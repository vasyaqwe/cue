import { comment, insertCommentParams } from "@/comment/schema"
import { organizationProtectedProcedure, protectedProcedure } from "@/lib/trpc"
import { createServerFn } from "@tanstack/start"
import { and, desc, eq } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(z.object({ organizationId: z.string(), issueId: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db.query.comment.findMany({
            where: and(
               eq(comment.organizationId, input.organizationId),
               eq(comment.issueId, input.issueId),
            ),
            columns: {
               id: true,
               content: true,
               createdAt: true,
            },
            with: {
               author: {
                  columns: {
                     id: true,
                     name: true,
                     avatarUrl: true,
                  },
               },
            },
            orderBy: [desc(comment.createdAt)],
         })
      }),
)

export const insert = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(insertCommentParams)
      .mutation(async ({ ctx, input }) => {
         const createdComment = await ctx.db
            .insert(comment)
            .values({
               organizationId: input.organizationId,
               issueId: input.issueId,
               authorId: ctx.user.id,
               content: input.content,
            })
            .returning()
            .get()

         return createdComment
      }),
)

export const deleteFn = createServerFn(
   "POST",
   protectedProcedure
      .input(z.object({ commentId: z.string() }))
      .mutation(async ({ ctx, input }) => {
         await ctx.db
            .delete(comment)
            .where(
               and(
                  eq(comment.id, input.commentId),
                  eq(comment.authorId, ctx.user.id),
               ),
            )
      }),
)
