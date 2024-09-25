import {
   insertOrganizationParams,
   organizationMembers,
   organizations,
} from "@/db/schema"
import { protectedProcedure } from "@/lib/trpc"
import { createServerFn } from "@tanstack/start"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const byInviteCode = createServerFn(
   "GET",
   protectedProcedure
      .input(z.object({ inviteCode: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db.query.organizations.findFirst({
            where: eq(organizations.inviteCode, input.inviteCode),
            columns: {
               name: true,
            },
         })
      }),
)

export const memberships = createServerFn(
   "GET",
   protectedProcedure.query(async ({ ctx }) => {
      return await ctx.db.query.organizationMembers.findMany({
         where: eq(organizationMembers.id, ctx.user.id),
         with: {
            organization: {
               columns: {
                  id: true,
                  slug: true,
                  name: true,
               },
            },
         },
      })
   }),
)

export const insert = createServerFn(
   "POST",
   protectedProcedure
      .input(insertOrganizationParams)
      .mutation(async ({ ctx, input }) => {
         const existingOrg = await ctx.db.query.organizations.findFirst({
            where: eq(organizations.slug, input.slug),
         })

         if (existingOrg) throw new TRPCError({ code: "CONFLICT" })

         await ctx.db.transaction(async (transaction) => {
            const [createdOrganization] = await transaction
               .insert(organizations)
               .values({
                  name: input.name,
                  slug: input.slug,
               })
               .returning({
                  id: organizations.id,
               })

            if (!createdOrganization) throw new Error("Error")

            await transaction.insert(organizationMembers).values({
               organizationId: createdOrganization.id,
               id: ctx.user.id,
            })
         })
      }),
)
