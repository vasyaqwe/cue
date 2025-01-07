import {
   favorite,
   favoriteEntityTypes,
   insertFavoriteParams,
} from "@/favorite/schema"
import { issue } from "@/issue/schema"
import { organizationMemberMiddleware } from "@/organization/middleware"
import { authMiddleware } from "@/user/middleware"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { and, desc, eq } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .validator(zodValidator(z.object({ organizationId: z.string() })))
   .handler(async ({ context, data }) => {
      return await context.db
         .select({
            id: favorite.id,
            entityId: favorite.entityId,
            entityType: favorite.entityType,
            issue: {
               title: issue.title,
               status: issue.status,
            },
         })
         .from(favorite)
         .innerJoin(
            issue,
            and(
               eq(issue.id, favorite.entityId),
               eq(favorite.entityType, "issue"),
            ),
         )
         .where(
            and(
               eq(favorite.organizationId, data.organizationId),
               eq(favorite.userId, context.user.id),
            ),
         )
         .orderBy(desc(favorite.createdAt))
   })

export const insert = createServerFn({ method: "POST" })
   .middleware([organizationMemberMiddleware])
   .validator(zodValidator(insertFavoriteParams))
   .handler(async ({ context, data }) => {
      return await context.db
         .insert(favorite)
         .values({
            organizationId: data.organizationId,
            userId: context.user.id,
            entityId: data.entityId,
            entityType: data.entityType,
         })
         .returning()
         .get()
   })

export const deleteFn = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(
      zodValidator(
         z.object({
            entityId: z.string(),
            organizationId: z.string(),
            entityType: z.enum(favoriteEntityTypes),
         }),
      ),
   )
   .handler(async ({ context, data }) => {
      await context.db
         .delete(favorite)
         .where(
            and(
               eq(favorite.entityId, data.entityId),
               eq(favorite.organizationId, data.organizationId),
               eq(favorite.userId, context.user.id),
            ),
         )
   })
