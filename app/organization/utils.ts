import type { Database } from "@/db"
import { organization, organizationMember } from "@/organization/schema"
import { eq } from "drizzle-orm"

export const joinOrganization = async ({
   db,
   userId,
   inviteCode,
}: { db: Database; userId: string; inviteCode: string }) => {
   const organizationToJoin = await db.query.organization.findFirst({
      where: eq(organization.inviteCode, inviteCode),
      columns: {
         id: true,
         slug: true,
      },
   })

   if (!organizationToJoin) throw new Error("Organization to join not found")

   await db
      .insert(organizationMember)
      .values({
         id: userId,
         organizationId: organizationToJoin.id,
      })
      .onConflictDoNothing()

   return organizationToJoin
}
