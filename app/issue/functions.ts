import { insertIssueParams, issues, updateIssueParams } from "@/db/schema"
import { organizationProtectedProcedure } from "@/lib/trpc"
import { createServerFn } from "@tanstack/start"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db.query.issues.findMany({
            where: eq(issues.organizationId, input.organizationId),
            orderBy: [desc(issues.createdAt)],
         })
      }),
)

export const byId = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(z.object({ issueId: z.string() }))
      .query(async ({ ctx, input }) => {
         return (
            (await ctx.db.query.issues.findFirst({
               where: eq(issues.id, input.issueId),
            })) ?? null
         )
      }),
)

export const insert = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(insertIssueParams)
      .mutation(async ({ ctx, input }) => {
         return await ctx.db.insert(issues).values(input).returning().get()
      }),
)

export const update = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(updateIssueParams)
      .mutation(async ({ ctx, input }) => {
         return await ctx.db
            .update(issues)
            .set(input)
            .where(eq(issues.id, input.id))
      }),
)

export const deleteFn = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(z.object({ issueId: z.string() }))
      .mutation(async ({ ctx, input }) => {
         await ctx.db.delete(issues).where(eq(issues.id, input.issueId))
      }),
)
