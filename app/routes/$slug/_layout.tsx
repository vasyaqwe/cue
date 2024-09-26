import { meQuery } from "@/auth/queries"
import { ModalProvider } from "@/modals"
import { organizationBySlugQuery } from "@/organization/queries"
import { Presence } from "@/presence"
import { Logo } from "@/ui/components/logo"
import { cn } from "@/ui/utils"
import {
   Outlet,
   createFileRoute,
   notFound,
   redirect,
} from "@tanstack/react-router"
import { Sidebar } from "./-components/sidebar"

export const Route = createFileRoute("/$slug/_layout")({
   component: Component,
   beforeLoad: async ({ context, params }) => {
      const session = await context.queryClient
         .ensureQueryData(meQuery())
         .catch(() => {
            throw redirect({ to: "/login" })
         })
      if (!session?.session || !session.user) throw redirect({ to: "/login" })

      const organization = await context.queryClient.ensureQueryData(
         organizationBySlugQuery({ slug: params.slug }),
      )

      if (!organization) throw notFound()

      return {
         organizationId: organization.id,
      }
   },
   pendingComponent: () => (
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
         <Logo className="mx-auto animate-fade-in" />
         <h1 className="mt-4 animate-fade-in text-center font-medium text-foreground/80 opacity-0 delay-300 duration-500">
            Workspace is loading...
         </h1>
      </div>
   ),
})

function Component() {
   return (
      <>
         <Presence />
         <ModalProvider />
         <div className="md:flex">
            <Sidebar />
            <div
               className={cn("flex-1")}
               style={{
                  paddingBottom: `max(calc(env(safe-area-inset-bottom) + 8rem), 7rem)`,
               }}
            >
               <Outlet />
            </div>
         </div>
         {/* <BottomMenu /> */}
      </>
   )
}
