import { insertIssueParams, issues, listIssuesParams } from "@/db/schema"
import { organizationProtectedProcedure } from "@/lib/trpc"
import { createServerFn } from "@tanstack/start"
import { eq } from "drizzle-orm"

export const list = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(listIssuesParams)
      .query(async ({ ctx, input }) => {
         return await ctx.db.query.issues.findMany({
            where: eq(issues.organizationId, input.organizationId),
         })
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
