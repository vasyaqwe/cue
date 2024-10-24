import { createTable, generateId, lifecycleDates } from "@/db/utils"
import { issueStatuses } from "@/issue/schema"
import { organization } from "@/organization/schema"
import { user } from "@/user/schema"
import { index, text, uniqueIndex } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

export const favoriteEntityTypes = ["issue"] as const
export type FavoriteEntityType = (typeof favoriteEntityTypes)[number]

export const favorite = createTable(
   "favorite",
   {
      id: generateId("favorite"),
      organizationId: text("organization_id")
         .references(() => organization.id, { onDelete: "cascade" })
         .notNull(),
      userId: text("user_id")
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      entityId: text("entity_id").notNull(),
      entityType: text("entity_type", {
         enum: favoriteEntityTypes,
      }).notNull(),
      ...lifecycleDates,
   },
   (table) => {
      return {
         favoriteOrganizationIdIdx: index("favorite_organization_id_idx").on(
            table.organizationId,
         ),
         favoriteUniqueIdx: uniqueIndex("favorite_unique_idx").on(
            table.userId,
            table.entityType,
            table.entityId,
         ),
      }
   },
)

export const insertFavoriteParams = createInsertSchema(favorite)
   .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
   })
   .extend({
      issue: z.object({
         title: z.string(),
         status: z.enum(issueStatuses),
      }),
   })
