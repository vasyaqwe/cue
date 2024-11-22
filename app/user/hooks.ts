import { organizationBySlugQuery } from "@/organization/queries"
import { userMeQuery } from "@/user/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getRouteApi } from "@tanstack/react-router"

const LayoutRoute = getRouteApi("/$slug/_layout")

export function useAuth() {
   const params = LayoutRoute.useParams()
   const user = useSuspenseQuery(userMeQuery())
   const organization = useSuspenseQuery(
      organizationBySlugQuery({ slug: params.slug }),
   )

   if (!organization.data || !user?.data)
      throw new Error("Organization not found")

   return {
      user: user.data,
      organization: organization.data,
      organizationId: organization?.data.id,
   }
}
