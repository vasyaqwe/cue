import { favorite } from "@/favorite/schema"
import { insertIssueParams, issue, updateIssueParams } from "@/issue/schema"
import { user } from "@/user/schema"
import { organizationMemberMiddleware } from "@/utils/middleware"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { and, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn({ method: "GET" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(z.object({ organizationId: z.string() })))
   .handler(async ({ context, data }) => {
      return await context.db
         .select({
            id: issue.id,
            title: issue.title,
            status: issue.status,
            label: issue.label,
            createdAt: issue.createdAt,
            isFavorited: sql<boolean>`CASE WHEN ${favorite.id} IS NOT NULL THEN true ELSE false END`,
         })
         .from(issue)
         .leftJoin(
            favorite,
            and(
               eq(favorite.entityId, issue.id),
               eq(favorite.entityType, "issue"),
               eq(favorite.userId, context.session.userId),
            ),
         )
         .where(eq(issue.organizationId, data.organizationId))
         .orderBy(desc(issue.createdAt))
         .then((rows) =>
            rows.map((row) => ({
               ...row,
               isFavorited: Boolean(row.isFavorited),
            })),
         )
   })

export const byId = createServerFn({ method: "GET" })
   .validator(zodValidator(z.object({ issueId: z.string() })))
   .middleware([organizationMemberMiddleware])
   .handler(async ({ context, data }) => {
      return await context.db
         .select({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            status: issue.status,
            label: issue.label,
            createdAt: issue.createdAt,
            author: {
               id: user.id,
               name: user.name,
               avatarUrl: user.avatarUrl,
            },
            isFavorited: sql<boolean>`CASE WHEN ${favorite.id} IS NOT NULL THEN true ELSE false END`,
         })
         .from(issue)
         .innerJoin(user, eq(issue.authorId, user.id))
         .leftJoin(
            favorite,
            and(
               eq(favorite.entityId, issue.id),
               eq(favorite.entityType, "issue"),
               eq(favorite.userId, context.session.userId),
            ),
         )
         .where(eq(issue.id, data.issueId))
         .limit(1)
         .then((rows) => {
            const result = rows[0]
            if (!result) return null
            return { ...result, isFavorited: Boolean(result.isFavorited) }
         })
   })

export const insert = createServerFn({ method: "POST" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(insertIssueParams))
   .handler(async ({ context, data }) => {
      return await context.db
         .insert(issue)
         .values({ ...data, authorId: context.user.id })
         .returning()
         .get()
   })

export const update = createServerFn({ method: "POST" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(updateIssueParams))
   .handler(async ({ context, data }) => {
      return await context.db
         .update(issue)
         .set({
            title: data.title,
            description: data.description,
            label: data.label,
            status: data.status,
         })
         .where(eq(issue.id, data.id))
         .returning({
            id: issue.id,
            title: issue.title,
            status: issue.status,
         })
         .get()
   })

export const deleteFn = createServerFn({ method: "POST" })
   .middleware([organizationMemberMiddleware])
   .validator(
      zodValidator(
         z.object({ issueId: z.string(), organizationId: z.string() }),
      ),
   )
   .handler(async ({ context, data }) => {
      await context.db.delete(issue).where(eq(issue.id, data.issueId))
   })
