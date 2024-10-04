import { organizationBySlugQuery } from "@/organization/queries"
import { userMeQuery } from "@/user/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getRouteApi } from "@tanstack/react-router"

const LayoutRoute = getRouteApi("/$slug/_layout")

export function useAuth() {
   const params = LayoutRoute.useParams()
   const session = useSuspenseQuery(userMeQuery())
   const organization = useSuspenseQuery(
      organizationBySlugQuery({ slug: params.slug }),
   )

   if (!organization.data || !session?.data?.session || !session.data.user)
      throw new Error("Organization not found")

   return {
      user: session.data.user,
      organization: organization.data,
      organizationId: organization?.data.id,
   }
}
