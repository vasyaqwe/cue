import {
   favorite,
   favoriteEntityTypes,
   insertFavoriteParams,
} from "@/favorite/schema"
import { issue } from "@/issue/schema"
import { organizationProtectedProcedure, protectedProcedure } from "@/lib/trpc"
import { createServerFn } from "@tanstack/start"
import { and, desc, eq } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn(
   "GET",
   protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db
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
                  eq(favorite.organizationId, input.organizationId),
                  eq(favorite.userId, ctx.user.id),
               ),
            )
            .orderBy(desc(favorite.createdAt))
      }),
)

export const insert = createServerFn(
   "POST",
   organizationProtectedProcedure
      .input(insertFavoriteParams)
      .mutation(async ({ ctx, input }) => {
         return await ctx.db
            .insert(favorite)
            .values({
               organizationId: input.organizationId,
               userId: ctx.user.id,
               entityId: input.entityId,
               entityType: input.entityType,
            })
            .returning()
            .get()
      }),
)

export const deleteFn = createServerFn(
   "POST",
   protectedProcedure
      .input(
         z.object({
            entityId: z.string(),
            organizationId: z.string(),
            entityType: z.enum(favoriteEntityTypes),
         }),
      )
      .mutation(async ({ ctx, input }) => {
         await ctx.db
            .delete(favorite)
            .where(
               and(
                  eq(favorite.entityId, input.entityId),
                  eq(favorite.organizationId, input.organizationId),
                  eq(favorite.userId, ctx.user.id),
               ),
            )
      }),
)
