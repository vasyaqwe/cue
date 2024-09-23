import { CreateOrganization } from "@/organization/components/create-organization"
import { organizationMembershipsQuery } from "@/organization/queries"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
   component: () => <CreateOrganization />,
   beforeLoad: async ({ context }) => {
      const memberships = await context.queryClient.ensureQueryData(
         organizationMembershipsQuery(),
      )

      const firstSlug = memberships[0]?.organization.slug
      if (firstSlug) {
         throw redirect({ to: `/${firstSlug}` })
      }
   },
})
