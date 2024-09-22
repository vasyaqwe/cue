import { authLoaderFn } from "@/auth/functions"
import { ModalProvider } from "@/modals"
import { CreateOrganization } from "@/organization/components/create-organization"
import { organizationMembershipsQuery } from "@/organization/queries"
import { Sidebar } from "@/routes/-components/sidebar"
import { Logo } from "@/ui/components/logo"
import { cn } from "@/ui/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout")({
   component: Component,
   beforeLoad: async () => {
      const session = await authLoaderFn()
      if (!session?.session || !session.user) throw redirect({ to: "/login" })
      console.log(session, "hello")

      return {
         user: session.user,
      }
   },
   loader: async ({ context, params }) => {
      const memberships = await context.queryClient.ensureQueryData(
         organizationMembershipsQuery(),
      )

      if ("slug" in params) return

      if (memberships.length > 0) {
         throw redirect({ to: `/${memberships[0]?.organization.slug}` })
      }
   },
   pendingComponent: () => (
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
         <Logo className="mx-auto" />
         <h1 className="mt-4 animate-fade-in text-center font-medium text-foreground/80 text-lg opacity-0 delay-300 duration-500">
            Loading...
         </h1>
      </div>
   ),
})

function Component() {
   const { data: memberships } = useSuspenseQuery(
      organizationMembershipsQuery(),
   )

   if (memberships.length === 0) return <CreateOrganization />

   return (
      <>
         {/* <Presence /> */}
         <ModalProvider />
         <div className="md:flex lg:gap-8 md:gap-5">
            <Sidebar />
            <div
               className={cn("flex-1 md:pt-5")}
               // style={{
               //    paddingBottom: isOnTagTimeFrenzyPage
               //       ? "0px"
               //       : `max(calc(env(safe-area-inset-bottom) + 8rem), 7rem)`,
               // }}
            >
               <Outlet />
            </div>
         </div>
         {/* <BottomMenu /> */}
      </>
   )
}
