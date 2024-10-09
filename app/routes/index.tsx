import { CreateOrganization } from "@/organization/components/create-organization"
import { organizationMembershipsQuery } from "@/organization/queries"
import { Homepage } from "@/routes/-components/homepage"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { P, match } from "ts-pattern"

export const Route = createFileRoute("/")({
   component: Component,
   beforeLoad: async ({ context }) => {
      const memberships = await context.queryClient.ensureQueryData(
         organizationMembershipsQuery(),
      )

      const firstSlug = memberships?.[0]?.organization.slug

      match(firstSlug).with(P.not(undefined), (slug) => {
         throw redirect({ to: "/$slug", params: { slug } })
      })
   },
   errorComponent: Homepage,
})

function Component() {
   return <CreateOrganization />
}
