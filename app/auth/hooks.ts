import { meQuery } from "@/auth/queries"
import { organizationMembershipsQuery } from "@/organization/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getRouteApi } from "@tanstack/react-router"

const LayoutRoute = getRouteApi("/$slug/_layout")

export function useAuth() {
   const params = LayoutRoute.useParams()
   const { data: session } = useSuspenseQuery(meQuery())
   const { data: memberships } = useSuspenseQuery(
      organizationMembershipsQuery(),
   )

   const organization = memberships.find(
      (m) => m.organization.slug === params.slug,
   )?.organization

   if (!organization || !session?.session || !session.user)
      throw new Error("Organization not found")

   return {
      user: session.user,
      memberships,
      organization,
      organizationId: organization?.id,
   }
}
