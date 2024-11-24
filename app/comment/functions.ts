import {
   comment,
   insertCommentParams,
   updateCommentParams,
} from "@/comment/schema"
import {
   authMiddleware,
   organizationMemberMiddleware,
} from "@/utils/middleware"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { and, asc, eq } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn({ method: "GET" })
   .middleware([organizationMemberMiddleware])
   .validator(
      zodValidator(
         z.object({ organizationId: z.string(), issueId: z.string() }),
      ),
   )
   .handler(async ({ context, data }) => {
      return await context.db.query.comment.findMany({
         where: and(
            eq(comment.organizationId, data.organizationId),
            eq(comment.issueId, data.issueId),
         ),
         columns: {
            id: true,
            content: true,
            createdAt: true,
            issueId: true,
         },
         with: {
            resolvedBy: {
               columns: {
                  name: true,
                  avatarUrl: true,
               },
            },
            author: {
               columns: {
                  id: true,
                  name: true,
                  avatarUrl: true,
               },
            },
         },
         orderBy: [asc(comment.createdAt)],
      })
   })

export const insert = createServerFn({ method: "POST" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(insertCommentParams))
   .handler(async ({ context, data }) => {
      return await context.db
         .insert(comment)
         .values({
            organizationId: data.organizationId,
            issueId: data.issueId,
            authorId: context.user.id,
            content: data.content,
         })
         .returning()
         .get()
   })

export const update = createServerFn({ method: "POST" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(updateCommentParams))
   .handler(async ({ context, data }) => {
      await context.db
         .update(comment)
         .set({
            resolvedById: data.resolvedById,
         })
         .where(eq(comment.id, data.id))
   })

export const deleteFn = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(zodValidator(z.object({ commentId: z.string() })))
   .handler(async ({ context, data }) => {
      await context.db
         .delete(comment)
         .where(
            and(
               eq(comment.id, data.commentId),
               eq(comment.authorId, context.user.id),
            ),
         )
   })
