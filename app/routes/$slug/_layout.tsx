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
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/start"
import { useEffect } from "react"
import { getRequestHeader } from "vinxi/http"
import { Sidebar } from "./-components/sidebar"

export const getDevice = createServerFn({ method: "GET" }).handler(async () => {
   const userAgent = getRequestHeader("user-agent")
   if (!userAgent) return "desktop"

   return /mobile/i.test(userAgent) && !/iPad|Tablet/i.test(userAgent)
      ? "mobile"
      : "desktop"
})

export const Route = createFileRoute("/$slug/_layout")({
   component: Component,
   beforeLoad: async ({ context, params }) => {
      const [user, organization, device] = await Promise.all([
         context.queryClient.ensureQueryData(userMeQuery()).catch(() => {
            throw redirect({ to: "/login" })
         }),
         context.queryClient
            .ensureQueryData(organizationBySlugQuery({ slug: params.slug }))
            .catch(() => {
               throw redirect({ to: "/login" })
            }),
         getDevice(),
      ])

      if (!user) throw redirect({ to: "/login" })
      if (!organization) throw notFound()

      return {
         device,
         organizationId: organization.id,
      }
   },
   loader: ({ context }) => {
      context.queryClient.ensureQueryData(organizationMembershipsQuery())
      context.queryClient.ensureQueryData(
         notificationUnreadCountQuery({
            organizationId: context.organizationId,
         }),
      )
   },
   pendingComponent: () => (
      <main className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
         <Logo className="mx-auto animate-fade-in opacity-0 [--animation-delay:100ms]" />
         <h1 className="mt-4 animate-fade-in text-center font-medium text-foreground/80 opacity-0 duration-500 [--animation-delay:600ms]">
            Workspace is loading...
         </h1>
      </main>
   ),
})

function Component() {
   useIssueSocket()
   useNotificationSocket()
   useCommentSocket()
   const { organizationId } = useAuth()

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

   return (
      <>
         <Presence />
         <ModalProvider />
         <Sidebar />
         <main
            className={cn(
               "flex h-[calc(100svh-var(--bottom-menu-height))] md:h-svh md:flex-1",
            )}
         >
            <div className={cn("relative flex flex-1 flex-col")}>
               <Outlet />
            </div>
         </main>
         <BottomMenu />
      </>
   )
}
