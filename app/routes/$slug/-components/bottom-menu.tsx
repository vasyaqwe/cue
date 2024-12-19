import { DraftIndicator } from "@/issue/components/draft-indicator"
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
import { useParams } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { match } from "ts-pattern"

export function BottomMenu() {
   const { slug } = useParams({ from: "/$slug/_layout" })
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

   return (
      <nav className="fixed bottom-0 z-[2] h-[var(--bottom-menu-height)] w-full border-border border-t bg-background p-1.5 shadow md:hidden">
         <ul className="flex flex-1 items-center justify-around gap-2">
            <li className="flex flex-1">
               <Link
                  preload={"render"}
                  params={{ slug }}
                  activeOptions={{ exact: true }}
                  activeProps={{
                     "aria-current": "page",
                  }}
                  to={homeRoute.to}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/55 transition-colors aria-[current=page]:text-foreground"
               >
                  <Icons.home className="size-7" />
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  params={{ slug }}
                  activeProps={{
                     onTouchEnd: () =>
                        match(refreshNotifications.isRefreshing).with(
                           false,
                           () => refreshNotifications.refresh(),
                        ),
                     "aria-current": "page",
                  }}
                  onClick={() =>
                     useNotificationStore.setState({ activeItemIssueId: null })
                  }
                  to={inboxRoute.to}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/50 transition-colors aria-[current=page]:text-foreground/95"
                  data-has-unread={unreadCount.data.count > 0}
               >
                  <Icons.inbox className="size-[29px]" />
               </Link>
            </li>
            <li className="flex flex-1">
               <button
                  onClick={() => pushModal("create_issue")}
                  className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-md text-foreground/55 transition-colors active:text-foreground"
               >
                  <div className="relative">
                     <Icons.pencil className="size-[28px] [&>path:first-child]:opacity-0" />
                     <DraftIndicator />
                  </div>
               </button>
            </li>
            <li className="flex flex-1">
               <Link
                  preload={"render"}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/55 transition-colors aria-[current=page]:text-foreground"
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
                  preload={"render"}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/55 transition-colors aria-[current=page]:text-foreground"
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
