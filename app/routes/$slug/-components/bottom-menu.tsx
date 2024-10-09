import { DraftIndicator } from "@/issue/components/draft-indicator"
import { issueListQuery } from "@/issue/queries"
import { useIssueStore } from "@/issue/store"
import { pushModal } from "@/modals"
import {
   notificationListQuery,
   notificationUnreadCountQuery,
} from "@/notification/queries"
import { useNotificationStore } from "@/notification/store"
import { Route as homeRoute } from "@/routes/$slug/_layout"
import { Route as inboxRoute } from "@/routes/$slug/_layout/inbox/_layout/index"
import { Route as peopleRoute } from "@/routes/$slug/_layout/people"
import { Route as settingsRoute } from "@/routes/$slug/_layout/settings"
import { Icons } from "@/ui/components/icons"
import { useRefreshState } from "@/ui/components/refresh-control/use-refresh-state"
import { useAuth } from "@/user/hooks"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useLocation, useParams } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { match } from "ts-pattern"

export function BottomMenu() {
   const { slug } = useParams({ from: "/$slug/_layout" })
   const { pathname } = useLocation()
   const { organizationId } = useAuth()
   const unreadCount = useSuspenseQuery(
      notificationUnreadCountQuery({ organizationId }),
   )

   const notifications = useSuspenseQuery(
      notificationListQuery({ organizationId }),
   )
   const refreshNotifications = useRefreshState({
      isRefetching: notifications.isRefetching,
      refetch: notifications.refetch,
      onChange: (isRefreshing) =>
         useNotificationStore.setState({
            isRefreshing,
         }),
   })

   const issues = useSuspenseQuery(issueListQuery({ organizationId }))
   const refreshIssues = useRefreshState({
      isRefetching: issues.isRefetching,
      refetch: issues.refetch,
      onChange: (isRefreshing) =>
         useIssueStore.setState({
            isRefreshing,
         }),
   })

   const isOnIssuePage = pathname.includes("/issue/")
   if (isOnIssuePage) return null

   return (
      <nav className="fixed bottom-0 z-[2] h-[calc(var(--bottom-menu-height)+max(env(safe-area-inset-bottom),0px))] w-full border-border border-t bg-background p-1.5 shadow md:hidden">
         <ul className="flex flex-1 items-center justify-around gap-2">
            <li className="flex flex-1">
               <Link
                  params={{ slug }}
                  activeOptions={{ exact: true }}
                  activeProps={{
                     onTouchEnd: () =>
                        match(refreshIssues.isRefreshing)
                           .with(true, () => {})
                           .otherwise(() => refreshIssues.refresh()),
                     "aria-current": "page",
                  }}
                  to={homeRoute.to}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/50 transition-colors aria-[current=page]:text-foreground"
               >
                  <Icons.issues className="size-7" />
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  params={{ slug }}
                  activeProps={{
                     onTouchEnd: () =>
                        match(refreshNotifications.isRefreshing)
                           .with(true, () => {})
                           .otherwise(() => refreshNotifications.refresh()),
                     "aria-current": "page",
                  }}
                  onClick={() =>
                     useNotificationStore.setState({ activeItemId: null })
                  }
                  to={inboxRoute.to}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/50 transition-colors aria-[current=page]:text-foreground"
                  data-has-unread={unreadCount.data.count > 0}
               >
                  <Icons.inbox className="size-[29px]" />
               </Link>
            </li>
            <li className="flex flex-1">
               <button
                  onClick={() => pushModal("create_issue")}
                  className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-md text-foreground/50 transition-colors active:text-foreground"
               >
                  <div className="relative">
                     <Icons.pencil className="size-[27px] [&>path:first-child]:opacity-0" />
                     <DraftIndicator />
                  </div>
               </button>
            </li>
            <li className="flex flex-1">
               <Link
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/50 transition-colors aria-[current=page]:text-foreground"
                  params={{ slug }}
                  activeProps={{
                     "aria-current": "page",
                  }}
                  to={peopleRoute.to}
               >
                  <Icons.people className="size-7" />
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/50 transition-colors aria-[current=page]:text-foreground"
                  params={{ slug }}
                  activeProps={{
                     "aria-current": "page",
                  }}
                  to={settingsRoute.to}
               >
                  <Icons.settings className="size-7" />
               </Link>
            </li>
         </ul>
      </nav>
   )
}
