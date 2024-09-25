import { insertIssueParams, issues } from "@/db/schema"
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
         return await ctx.db
            .insert(issues)
            .values(input)
            .returning({ issueId: issues.id })
            .get()
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
