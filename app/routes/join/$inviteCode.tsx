import * as organization from "@/organization/functions"
import { userMeQuery } from "@/user/queries"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/join/$inviteCode")({
   component: () => null,
   beforeLoad: async ({ params, context }) => {
      const user = await context.queryClient
         .ensureQueryData(userMeQuery())
         .catch(() => {
            throw redirect({
               to: "/login",
               search: { inviteCode: params.inviteCode },
            })
         })

      if (!user) throw redirect({ to: "/login" })

      await organization.join({
         data: { inviteCode: params.inviteCode },
      })
   },
})
