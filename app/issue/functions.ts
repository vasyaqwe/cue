import { insertIssueParams, issue, updateIssueParams } from "@/issue/schema"
import { organizationProtectedProcedure } from "@/lib/trpc"
import { createServerFn } from "@tanstack/start"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db.query.issue.findMany({
            where: eq(issue.organizationId, input.organizationId),
            orderBy: [desc(issue.createdAt)],
         })
      }),
)

export const byId = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(z.object({ issueId: z.string() }))
      .query(async ({ ctx, input }) => {
         return (
            (await ctx.db.query.issue.findFirst({
               where: eq(issue.id, input.issueId),
            })) ?? null
         )
      }),
)

export const insert = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(insertIssueParams)
      .mutation(async ({ ctx, input }) => {
         return await ctx.db.insert(issue).values(input).returning().get()
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
