import { useCommentSocket } from "@/comment/hooks/use-comment-socket"
import { useIssueSocket } from "@/issue/hooks/use-issue-socket"
import { ModalProvider } from "@/modals"
import { useNotificationSocket } from "@/notification/hooks/use-notification-socket"
import { notificationUnreadCountQuery } from "@/notification/queries"
import {
   organizationBySlugQuery,
   organizationMembershipsQuery,
} from "@/organization/queries"
import { Presence } from "@/presence"
import { BottomMenu } from "@/routes/$slug/-components/bottom-menu"
import { Logo } from "@/ui/components/logo"
import { MOBILE_BREAKPOINT } from "@/ui/constants"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { userMeQuery } from "@/user/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
   Outlet,
   createFileRoute,
   notFound,
   redirect,
   useLocation,
} from "@tanstack/react-router"
import { useEffect } from "react"
import { Sidebar } from "./-components/sidebar"

export const Route = createFileRoute("/$slug/_layout")({
   component: Component,
   beforeLoad: async ({ context, params }) => {
      const session = await context.queryClient
         .ensureQueryData(userMeQuery())
         .catch(() => {
            throw redirect({ to: "/login" })
         })
      if (!session?.session || !session.user) throw redirect({ to: "/login" })

      const organization = await context.queryClient.ensureQueryData(
         organizationBySlugQuery({ slug: params.slug }),
      )
      if (!organization) throw notFound()

      context.queryClient.prefetchQuery(organizationMembershipsQuery())
      context.queryClient.prefetchQuery(
         notificationUnreadCountQuery({ organizationId: organization.id }),
      )

      return {
         organizationId: organization.id,
      }
   },
   pendingComponent: () => (
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
         <Logo className="mx-auto animate-fade-in opacity-0 [--animation-delay:300ms]" />
         <h1 className="mt-4 animate-fade-in text-center font-medium text-foreground/80 opacity-0 duration-500 [--animation-delay:750ms]">
            Workspace is loading...
         </h1>
      </div>
   ),
})

function Component() {
   useIssueSocket()
   useNotificationSocket()
   useCommentSocket()
   const { organizationId } = useAuth()
   const { pathname } = useLocation()

   const unreadCount = useSuspenseQuery(
      notificationUnreadCountQuery({ organizationId }),
   )

   useEffect(() => {
      if (typeof window === "undefined") return

      const link = document.querySelector("link[rel~='icon']")
      if (!link || "href" in link === false) return

      if (unreadCount.data.count === 0) {
         link.href = "/favicon.ico"

         return
      }

      link.href = "/favicon-badged.ico"
   }, [unreadCount.data.count])

   useEffect(() => {
      if (typeof window === "undefined") {
         return
      }
      document.documentElement.style.overflow = "hidden"
   }, [])

   useEffect(() => {
      if (typeof window === "undefined") return

      const checkDevice = (event: MediaQueryList | MediaQueryListEvent) => {
         useUIStore.setState({ isMobile: event.matches })
      }

      const mediaQueryList = window.matchMedia(
         `(max-width: ${MOBILE_BREAKPOINT}px)`,
      )
      checkDevice(mediaQueryList)

      mediaQueryList.addEventListener("change", checkDevice)

      return () => {
         mediaQueryList.removeEventListener("change", checkDevice)
      }
   }, [])

   const isOnIssuePage = pathname.includes("/issue/")

   return (
      <>
         <Presence />
         <ModalProvider />
         <Sidebar />
         <div
            className={cn(
               "md:h-svh md:flex-1",
               isOnIssuePage
                  ? "h-svh"
                  : "h-[calc(100svh-var(--bottom-menu-height))]",
            )}
         >
            <Outlet />
         </div>
         <BottomMenu />
      </>
   )
}
