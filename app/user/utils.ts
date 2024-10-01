import type { Database } from "@/db"
import { organizationMembers, organizations } from "@/organization/schema"
import { eq } from "drizzle-orm"

export const joinInvitedOrganization = async ({
   db,
   userId,
   inviteCode,
}: { db: Database; userId: string; inviteCode: string }) => {
   const organizationToJoin = await db.query.organizations.findFirst({
      where: eq(organizations.inviteCode, inviteCode),
      columns: {
         id: true,
         slug: true,
      },
   })

   if (!organizationToJoin) throw new Error("Organization to join not found")

   await db.insert(organizationMembers).values({
      id: userId,
      organizationId: organizationToJoin.id,
   })

   return organizationToJoin
}
