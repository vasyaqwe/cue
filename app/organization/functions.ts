import { issue } from "@/issue/schema"
import {
   organizationProtectedProcedure,
   protectedProcedure,
   publicProcedure,
} from "@/lib/trpc"
import { RESERVED_SLUGS } from "@/organization/constants"
import {
   insertOrganizationParams,
   organization,
   organizationMember,
} from "@/organization/schema"
import { APP_USER_ID } from "@/user/constants"
import { session } from "@/user/schema"
import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/start"
import { TRPCError } from "@trpc/server"
import { and, eq, ne } from "drizzle-orm"
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
         const foundOrg = await ctx.db.query.organization.findFirst({
            where: and(eq(organization.slug, input.slug)),
            columns: {
               id: true,
               slug: true,
               name: true,
               inviteCode: true,
            },
         })

         const membership = ctx.session.organizationMemberships.some(
            (membership) => membership.organizationId === foundOrg?.id,
         )

         if (!foundOrg || !membership) return null

         return foundOrg
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

export const teammatesIds = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ ctx, input }) => {
         return (
            await ctx.db.query.organizationMember.findMany({
               where: and(
                  eq(organizationMember.organizationId, input.organizationId),
                  ne(organizationMember.id, ctx.user.id),
               ),
               columns: {
                  id: true,
               },
            })
         ).map((m) => m.id)
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
         if (RESERVED_SLUGS.includes(input.name.trim().toLowerCase()))
            throw new TRPCError({ code: "CONFLICT" })

         const existingOrg = await ctx.db.query.organization.findFirst({
            where: eq(organization.slug, input.slug),
         })

         if (existingOrg) throw new TRPCError({ code: "CONFLICT" })

         const createdOrganization = await ctx.db.transaction(async (tx) => {
            const [createdOrganization] = await tx
               .insert(organization)
               .values({
                  name: input.name,
                  slug: input.slug,
               })
               .returning({
                  id: organization.id,
               })

            if (!createdOrganization) throw new Error("Error")

            await tx.insert(organizationMember).values({
               organizationId: createdOrganization.id,
               id: ctx.user.id,
            })

            await tx
               .update(session)
               .set({
                  organizationMemberships: [
                     ...ctx.session.organizationMemberships,
                     {
                        organizationId: createdOrganization.id,
                     },
                  ],
               })
               .where(eq(session.userId, ctx.user.id))

            return createdOrganization
         })

         await ctx.db.insert(issue).values({
            organizationId: createdOrganization.id,
            title: "Welcome to Cue 👋",
            description: `<h3><strong>To start, press </strong><code class="rounded-md border border-border bg-elevated px-1.5 py-1 font-medium font-mono" spellcheck="false">C</code> to <strong>create your first issue.</strong></h3><p>Create issues from anywhere using <code class="rounded-md border border-border bg-elevated px-1.5 py-1 font-medium font-mono" spellcheck="false">C</code> or by clicking the <code class="rounded-md border border-border bg-elevated px-1.5 py-1 font-medium font-mono" spellcheck="false">New issue</code> button.</p><p>The issue editor and comments support markdown. You can also:</p><ul class="list-outside list-disc leading-3"><li class="leading-normal"><p>@mention a teammate or an issue</p></li><li class="leading-normal"><p>Drag &amp; drop images</p></li><li class="leading-normal"><p>Type <code class="rounded-md border border-border bg-elevated px-1.5 py-1 font-medium font-mono" spellcheck="false">/</code> to bring up more formatting options</p></li></ul>`,
            status: "todo",
            label: "feature",
            authorId: APP_USER_ID,
         })

         return createdOrganization.id
      }),
)

export const join = createServerFn(
   "POST",
   protectedProcedure
      .input(z.object({ inviteCode: z.string() }))
      .mutation(async ({ ctx, input }) => {
         const joinedOrg = await ctx.db.transaction(async (tx) => {
            const joinedOrg = await tx.query.organization.findFirst({
               where: eq(organization.inviteCode, input.inviteCode),
               columns: {
                  id: true,
                  slug: true,
               },
            })

            if (!joinedOrg) throw new Error("Organization to join not found")

            await tx
               .insert(organizationMember)
               .values({
                  id: ctx.user.id,
                  organizationId: joinedOrg.id,
               })
               .onConflictDoNothing()

            await tx
               .update(session)
               .set({
                  organizationMemberships: [
                     ...ctx.session.organizationMemberships,
                     {
                        organizationId: joinedOrg.id,
                     },
                  ],
               })
               .where(eq(session.userId, ctx.user.id))

            return joinedOrg
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
         return await ctx.db.transaction(async (tx) => {
            await tx
               .delete(organization)
               .where(eq(organization.id, input.organizationId))

            await tx
               .update(session)
               .set({
                  organizationMemberships:
                     ctx.session.organizationMemberships.filter(
                        (membership) =>
                           membership.organizationId !== input.organizationId,
                     ),
               })
               .where(eq(session.userId, ctx.user.id))
         })
      }),
)
