import { useUser } from "@/auth/hooks"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/")({
   component: Component,
})

function Component() {
   const user = useUser()
   return <div>Hello /! User: {JSON.stringify(user)}</div>
}
