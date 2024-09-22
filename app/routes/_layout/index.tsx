import { authLoaderFn } from "@/auth/functions"
import { useUser } from "@/auth/hooks"
import { Button } from "@/ui/components/button"
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
   return (
      <div className="container flex flex-col items-start gap-6">
         Hello /! User: {JSON.stringify(user)}
         <Button variant={"outline"}>Hello click</Button>
      </div>
   )
}
