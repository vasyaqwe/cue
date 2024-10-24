import { favorite } from "@/favorite/schema"
import { insertIssueParams, issue, updateIssueParams } from "@/issue/schema"
import { organizationProtectedProcedure } from "@/lib/trpc"
import { user } from "@/user/schema"
import { createServerFn } from "@tanstack/start"
import { and, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db
            .select({
               id: issue.id,
               title: issue.title,
               status: issue.status,
               label: issue.label,
               createdAt: issue.createdAt,
               isFavorited: sql<boolean>`CASE WHEN ${favorite.id} IS NOT NULL THEN true ELSE false END`,
            })
            .from(issue)
            .leftJoin(
               favorite,
               and(
                  eq(favorite.entityId, issue.id),
                  eq(favorite.entityType, "issue"),
                  eq(favorite.userId, ctx.session.userId),
               ),
            )
            .where(eq(issue.organizationId, input.organizationId))
            .orderBy(desc(issue.createdAt))
            .then((rows) =>
               rows.map((row) => ({
                  ...row,
                  isFavorited: Boolean(row.isFavorited),
               })),
            )
      }),
)

export const byId = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(z.object({ issueId: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db
            .select({
               id: issue.id,
               title: issue.title,
               description: issue.description,
               status: issue.status,
               label: issue.label,
               createdAt: issue.createdAt,
               author: {
                  id: user.id,
                  name: user.name,
                  avatarUrl: user.avatarUrl,
               },
               isFavorited: sql<boolean>`CASE WHEN ${favorite.id} IS NOT NULL THEN true ELSE false END`,
            })
            .from(issue)
            .innerJoin(user, eq(issue.authorId, user.id))
            .leftJoin(
               favorite,
               and(
                  eq(favorite.entityId, issue.id),
                  eq(favorite.entityType, "issue"),
                  eq(favorite.userId, ctx.session.userId),
               ),
            )
            .where(eq(issue.id, input.issueId))
            .limit(1)
            .then((rows) => {
               const result = rows[0]
               if (!result) return null
               return { ...result, isFavorited: Boolean(result.isFavorited) }
            })
      }),
)

export const insert = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(insertIssueParams)
      .mutation(async ({ ctx, input }) => {
         return await ctx.db
            .insert(issue)
            .values({ ...input, authorId: ctx.user.id })
            .returning()
            .get()
      }),
)

export const update = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(updateIssueParams)
      .mutation(async ({ ctx, input }) => {
         return await ctx.db
            .update(issue)
            .set({
               title: input.title,
               description: input.description,
               label: input.label,
               status: input.status,
            })
            .where(eq(issue.id, input.id))
            .returning({
               id: issue.id,
               title: issue.title,
               status: issue.status,
            })
            .get()
      }),
)

export const deleteFn = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(z.object({ issueId: z.string() }))
      .mutation(async ({ ctx, input }) => {
         await ctx.db.delete(issue).where(eq(issue.id, input.issueId))
      }),
)
