import { CreateOrganization } from "@/organization/components/create-organization"
import { organizationMembershipsQuery } from "@/organization/queries"
import { Homepage } from "@/routes/-components/homepage"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
   component: Component,
   beforeLoad: async ({ context }) => {
      const memberships = await context.queryClient.ensureQueryData(
         organizationMembershipsQuery(),
      )

      const firstSlug = memberships?.[0]?.organization.slug

      if (firstSlug) {
         throw redirect({ to: "/$slug", params: { slug: firstSlug } })
      }
   },
   errorComponent: Homepage,
})

function Component() {
   return <CreateOrganization />
}
