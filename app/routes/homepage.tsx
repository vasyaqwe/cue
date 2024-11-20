import { organizationMembershipsQuery } from "@/organization/queries"
import { Homepage } from "@/routes/-components/homepage"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/homepage")({
   beforeLoad: async ({ context }) => {
      await context.queryClient
         .ensureQueryData(organizationMembershipsQuery())
         .catch()
   },
   component: Component,
   errorComponent: Homepage,
})

function Component() {
   const memberships = useSuspenseQuery(organizationMembershipsQuery())

   return (
      <Homepage
         isAuthed
         memberships={memberships.data}
      />
   )
}
