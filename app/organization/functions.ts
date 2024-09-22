import { db } from "@/db"
import { organizationMembers, organizations } from "@/db/schema"
import { protectedProcedure } from "@/lib/trpc"
import { createServerFn } from "@tanstack/start"
import { and, eq } from "drizzle-orm"

export const organizationMembershipsFn = createServerFn(
   "GET",
   protectedProcedure.query(async ({ ctx }) => {
      return await db.query.organizationMembers.findMany({
         where: and(
            eq(organizationMembers.id, ctx.user.id),
            eq(organizationMembers.organizationId, organizations.id),
         ),
         with: {
            organization: {
               columns: {
                  slug: true,
                  name: true,
               },
            },
         },
      })
   }),
)
