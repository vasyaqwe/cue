import {
   byIdIssueParams,
   insertIssueParams,
   issues,
   listIssueParams,
} from "@/db/schema"
import { organizationProtectedProcedure } from "@/lib/trpc"
import { createServerFn } from "@tanstack/start"
import { desc, eq } from "drizzle-orm"

export const list = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(listIssueParams)
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
      .input(byIdIssueParams)
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
      .query(async ({ ctx, input }) => {
         await ctx.db.insert(issues).values(input)
      }),
)
