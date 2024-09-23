import { organizationMembershipsQuery } from "@/organization/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"

export function useOrganization() {
   const { slug } = useParams({ from: "/$slug/_layout" })
   const { data: memberships } = useSuspenseQuery(
      organizationMembershipsQuery(),
   )
   const membership = memberships.find((m) => m.organization.slug === slug)

   if (!membership) throw new Error("Organization not found")

   return {
      organization: membership.organization,
   }
}
