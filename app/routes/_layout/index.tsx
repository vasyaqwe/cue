import { authLoaderFn } from "@/auth/functions"
import { useUser } from "@/auth/hooks"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/")({
   beforeLoad: async () => {
      const session = await authLoaderFn()
      if (!session.session) throw redirect({ to: "/login" })
      return session
   },
   component: Component,
})

function Component() {
   const user = useUser()
   return <div>Hello /! User: {JSON.stringify(user)}</div>
}
