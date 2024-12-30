import { ServerFnError } from "@/error"
import { issue } from "@/issue/schema"
import { RESERVED_SLUGS } from "@/organization/constants"
import {
   insertOrganizationParams,
   organization,
   organizationMember,
} from "@/organization/schema"
import { APP_USER_ID } from "@/user/constants"
import { session, user } from "@/user/schema"
import {
   authMiddleware,
   baseMiddleware,
   organizationMemberMiddleware,
} from "@/utils/middleware"
import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { and, eq, ne } from "drizzle-orm"
import { z } from "zod"

export const byInviteCode = createServerFn({ method: "GET" })
   .middleware([baseMiddleware])
   .validator(zodValidator(z.object({ inviteCode: z.string() })))
   .handler(async ({ context, data }) => {
      return await context.db.query.organization.findFirst({
         where: eq(organization.inviteCode, data.inviteCode),
         columns: {
            name: true,
         },
      })
   })

export const bySlug = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .validator(zodValidator(z.object({ slug: z.string() })))
   .handler(async ({ context, data }) => {
      const foundOrg = await context.db.query.organization.findFirst({
         where: and(eq(organization.slug, data.slug)),
         columns: {
            id: true,
            slug: true,
            name: true,
            inviteCode: true,
         },
      })

      const membership = context.session.organizationMemberships.some(
         (membership) => membership.organizationId === foundOrg?.id,
      )

      if (!foundOrg || !membership) return null

      return foundOrg
   })

export const members = createServerFn({ method: "GET" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(z.object({ organizationId: z.string() })))
   .handler(async ({ context, data }) => {
      return await context.db.query.organizationMember.findMany({
         where: eq(organizationMember.organizationId, data.organizationId),
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
   })

export const teammatesIds = createServerFn({ method: "GET" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(z.object({ organizationId: z.string() })))
   .handler(async ({ context, data }) => {
      return (
         await context.db.query.organizationMember.findMany({
            where: and(
               eq(organizationMember.organizationId, data.organizationId),
               ne(organizationMember.id, context.user.id),
            ),
            columns: {
               id: true,
            },
         })
      ).map((m) => m.id)
   })

export const memberships = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      return await context.db.query.organizationMember.findMany({
         where: eq(organizationMember.id, context.user.id),
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
   })

export const insert = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(zodValidator(insertOrganizationParams))
   .handler(async ({ context, data }) => {
      if (RESERVED_SLUGS.includes(data.name.trim().toLowerCase()))
         throw new ServerFnError({
            code: "CONFLICT",
            message: "Organization URL is not available",
         })

      const existingOrg = await context.db.query.organization.findFirst({
         where: eq(organization.slug, data.slug),
      })

      if (existingOrg)
         throw new ServerFnError({
            code: "CONFLICT",
            message: "Organization URL is not available",
         })

      const createdOrganization = await context.db.transaction(async (tx) => {
         const [createdOrganization] = await tx
            .insert(organization)
            .values({
               name: data.name,
               slug: data.slug,
            })
            .returning({
               id: organization.id,
            })

         if (!createdOrganization)
            throw new ServerFnError({ code: "INTERNAL_SERVER_ERROR" })

         await tx.insert(organizationMember).values({
            organizationId: createdOrganization.id,
            id: context.user.id,
         })

         await tx
            .update(session)
            .set({
               organizationMemberships: [
                  ...context.session.organizationMemberships,
                  {
                     organizationId: createdOrganization.id,
                  },
               ],
            })
            .where(eq(session.userId, context.user.id))

         //  user with APP_USER_ID must exist in the database
         await tx
            .insert(user)
            .values({
               id: APP_USER_ID,
               email: "cue@cue.com",
               name: "Cue",
            })
            .onConflictDoNothing()

         await tx.insert(issue).values({
            organizationId: createdOrganization.id,
            title: "Welcome to Cue 👋",
            description: `<h3><strong>To start, press </strong><code class="rounded-md border border-border bg-elevated px-1.5 py-1 font-medium font-mono" spellcheck="false">C</code> to <strong>create your first issue.</strong></h3><p>Create issues from anywhere using <code class="rounded-md border border-border bg-elevated px-1.5 py-1 font-medium font-mono" spellcheck="false">C</code> or by clicking the <code class="rounded-md border border-border bg-elevated px-1.5 py-1 font-medium font-mono" spellcheck="false">New issue</code> button.</p><p>The issue editor and comments support markdown. You can also:</p><ul class="list-outside list-disc leading-3"><li class="leading-normal"><p>@mention a teammate or an issue</p></li><li class="leading-normal"><p>Drag &amp; drop images</p></li><li class="leading-normal"><p>Type <code class="rounded-md border border-border bg-elevated px-1.5 py-1 font-medium font-mono" spellcheck="false">/</code> to bring up more formatting options</p></li></ul>`,
            status: "todo",
            label: "feature",
            authorId: APP_USER_ID,
         })

         return createdOrganization
      })

      return createdOrganization.id
   })

export const join = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(zodValidator(z.object({ inviteCode: z.string() })))
   .handler(async ({ context, data }) => {
      const joinedOrg = await context.db.transaction(async (tx) => {
         const joinedOrg = await tx.query.organization.findFirst({
            where: eq(organization.inviteCode, data.inviteCode),
            columns: {
               id: true,
               slug: true,
            },
         })

         if (!joinedOrg)
            throw new ServerFnError({
               code: "NOT_FOUND",
               message: "Organization to join not found",
            })

         await tx
            .insert(organizationMember)
            .values({
               id: context.user.id,
               organizationId: joinedOrg.id,
            })
            .onConflictDoNothing()

         await tx
            .update(session)
            .set({
               organizationMemberships: [
                  ...context.session.organizationMemberships,
                  {
                     organizationId: joinedOrg.id,
                  },
               ],
            })
            .where(eq(session.userId, context.user.id))

         return joinedOrg
      })

      throw redirect({
         to: "/$slug",
         params: { slug: joinedOrg.slug },
      })
   })

export const deleteFn = createServerFn({ method: "POST" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(z.object({ organizationId: z.string() })))
   .handler(async ({ context, data }) => {
      return await context.db.transaction(async (tx) => {
         await tx
            .delete(organization)
            .where(eq(organization.id, data.organizationId))

         await tx
            .update(session)
            .set({
               organizationMemberships:
                  context.session.organizationMemberships.filter(
                     (membership) =>
                        membership.organizationId !== data.organizationId,
                  ),
            })
            .where(eq(session.userId, context.user.id))
      })
   })
