import { Homepage } from "@/routes/-components/homepage"
import { userMeQuery } from "@/user/queries"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/homepage")({
   beforeLoad: async ({ context }) => {
      await context.queryClient.ensureQueryData(userMeQuery())
   },
   component: Component,
   errorComponent: Homepage,
})

function Component() {
   return <Homepage isAuthed />
}
