import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/join/$inviteCode")({
   component: () => null,
   beforeLoad: ({ params }) => {
      throw redirect({
         to: "/login",
         search: { inviteCode: params.inviteCode },
      })
   },
})
