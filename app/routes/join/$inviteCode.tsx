import * as organization from "@/organization/functions"
import { userMeQuery } from "@/user/queries"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/join/$inviteCode")({
   component: () => null,
   beforeLoad: async ({ params, context }) => {
      const session = await context.queryClient
         .ensureQueryData(userMeQuery())
         .catch(() => {
            throw redirect({
               to: "/login",
               search: { inviteCode: params.inviteCode },
            })
         })

      if (!session?.session || !session.user) throw redirect({ to: "/login" })

      await organization.join({
         inviteCode: params.inviteCode,
      })
   },
})
