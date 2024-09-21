import { authLoaderFn } from "@/auth/functions"
import { ModalProvider } from "@/modals"
import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout")({
   component: Component,
   beforeLoad: async () => {
      const session = await authLoaderFn()
      if (!session) throw redirect({ to: "/login" })
      return session
   },
   pendingComponent: () => (
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
         <Icons.logo
            id="loading"
            className="mx-auto size-12 animate-fade-in opacity-0 delay-150 duration-500"
         />
         <h1 className="mt-4 animate-fade-in text-center font-medium text-foreground/80 text-lg opacity-0 delay-300 duration-500">
            Loading...
         </h1>
      </div>
   ),
})

function Component() {
   return (
      <>
         {/* <Presence /> */}
         <ModalProvider />

         <div className="md:container md:flex lg:gap-8 md:gap-5">
            {/* <Sidebar /> */}
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
