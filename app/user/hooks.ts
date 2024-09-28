import { organizationBySlugQuery } from "@/organization/queries"
import { userMeQuery } from "@/user/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getRouteApi } from "@tanstack/react-router"

const LayoutRoute = getRouteApi("/$slug/_layout")

export function useAuth() {
   const params = LayoutRoute.useParams()
   const { data: session } = useSuspenseQuery(userMeQuery())
   const { data: organization } = useSuspenseQuery(
      organizationBySlugQuery({ slug: params.slug }),
   )

   if (!organization || !session?.session || !session.user)
      throw new Error("Organization not found")

   return {
      user: session.user,
      organization,
      organizationId: organization?.id,
   }
}
