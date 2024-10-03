import {
   organizationProtectedProcedure,
   protectedProcedure,
   publicProcedure,
} from "@/lib/trpc"
import {
   insertOrganizationParams,
   organization,
   organizationMember,
} from "@/organization/schema"
import { joinOrganization } from "@/organization/utils"
import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/start"
import { TRPCError } from "@trpc/server"
import { and, eq, exists } from "drizzle-orm"
import { z } from "zod"

export const byInviteCode = createServerFn(
   "GET",
   publicProcedure
      .input(z.object({ inviteCode: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db.query.organization.findFirst({
            where: eq(organization.inviteCode, input.inviteCode),
            columns: {
               name: true,
            },
         })
      }),
)

export const bySlug = createServerFn(
   "GET",
   protectedProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ ctx, input }) => {
         return (
            (await ctx.db.query.organization.findFirst({
               where: and(
                  eq(organization.slug, input.slug),
                  // verify membership
                  exists(
                     ctx.db
                        .select()
                        .from(organizationMember)
                        .where(
                           and(
                              eq(organizationMember.id, ctx.user.id),
                              eq(
                                 organizationMember.organizationId,
                                 organization.id,
                              ),
                           ),
                        ),
                  ),
               ),
               columns: {
                  id: true,
                  slug: true,
                  name: true,
                  inviteCode: true,
               },
            })) ?? null
         )
      }),
)

export const members = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db.query.organizationMember.findMany({
            where: eq(organizationMember.organizationId, input.organizationId),
            columns: {},
            with: {
               user: {
                  columns: {
                     id: true,
                     name: true,
                     email: true,
                     avatarUrl: true,
                  },
               },
            },
         })
      }),
)

export const memberships = createServerFn(
   "GET",
   protectedProcedure.query(async ({ ctx }) => {
      return await ctx.db.query.organizationMember.findMany({
         where: eq(organizationMember.id, ctx.user.id),
         with: {
            organization: {
               columns: {
                  id: true,
                  slug: true,
                  name: true,
                  inviteCode: true,
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
         const existingOrg = await ctx.db.query.organization.findFirst({
            where: eq(organization.slug, input.slug),
         })

         if (existingOrg) throw new TRPCError({ code: "CONFLICT" })

         await ctx.db.transaction(async (transaction) => {
            const [createdOrganization] = await transaction
               .insert(organization)
               .values({
                  name: input.name,
                  slug: input.slug,
               })
               .returning({
                  id: organization.id,
               })

            if (!createdOrganization) throw new Error("Error")

            await transaction.insert(organizationMember).values({
               organizationId: createdOrganization.id,
               id: ctx.user.id,
            })
         })
      }),
)

export const join = createServerFn(
   "POST",
   protectedProcedure
      .input(z.object({ inviteCode: z.string() }))
      .mutation(async ({ ctx, input }) => {
         const joinedOrg = await joinOrganization({
            db: ctx.db,
            userId: ctx.user.id,
            inviteCode: input.inviteCode,
         })

         throw redirect({
            to: "/$slug",
            params: { slug: joinedOrg.slug },
         })
      }),
)

export const deleteFn = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .mutation(async ({ ctx, input }) => {
         await ctx.db
            .delete(organization)
            .where(eq(organization.id, input.organizationId))
      }),
)
