import type * as notificationFns from "@/inbox/functions"
import { inboxListQuery } from "@/inbox/queries"
import { StatusIcon } from "@/issue/components/icons"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
import { Icons } from "@/ui/components/icons"
import { Loading } from "@/ui/components/loading"
import { UserAvatar } from "@/ui/components/user-avatar"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { formatDate } from "@/utils/format"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
   Link,
   type LinkProps,
   Outlet,
   createFileRoute,
   useParams,
} from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$slug/_layout/inbox/_layout")({
   component: Component,
   meta: () => [{ title: "Inbox" }],
   loader: async ({ context }) => {
      context.queryClient.prefetchQuery(
         inboxListQuery({ organizationId: context.organizationId }),
      )
   },
   pendingComponent: () => (
      <>
         <Header className="md:max-w-[420px] md:border-r md:pl-0">
            <HeaderTitle>Inbox</HeaderTitle>
         </Header>
         <Main className="border-border/75 md:max-w-[420px] md:border-r">
            <Loading className="absolute inset-0 m-auto" />
         </Main>
      </>
   ),
})

function Component() {
   const { organizationId } = useAuth()
   const { issueId } = useParams({
      strict: false,
   })
   const { data: notifications } = useSuspenseQuery(
      inboxListQuery({ organizationId }),
   )
   const [activeItemId, setActiveItemId] = useState<string | null>(null)

   return (
      <Main className="flex max-h-[calc(100svh-var(--bottom-menu-height))] pb-0 md:max-h-svh">
         <div
            className={cn(
               "flex flex-1 shrink-0 flex-col border-border/75 2xl:max-w-[400px] lg:max-w-[320px] lg:border-r",
               issueId ? "max-lg:hidden" : "",
            )}
         >
            <Header
               className={cn(
                  "border-r-transparent md:pl-0",
                  issueId ? "max-md:hidden" : "",
               )}
            >
               <HeaderTitle>Inbox</HeaderTitle>
            </Header>
            <div
               className={cn(
                  "relative flex flex-1 shrink-0 overflow-y-auto",
                  issueId ? "max-md:hidden" : "",
               )}
            >
               {notifications.length === 0 ? (
                  <div className="absolute inset-0 m-auto h-fit">
                     <p className="flex flex-col items-center gap-4 text-center text-foreground/60 text-lg">
                        <Icons.inbox className=" size-20" />
                        Inbox is empty
                     </p>
                  </div>
               ) : (
                  <div className="w-full space-y-2 p-1.5">
                     {notifications.map((notification) => (
                        <Notification
                           key={notification.id}
                           onClick={() => setActiveItemId(notification.id)}
                           data-active={activeItemId === notification.id}
                           notification={notification}
                        />
                     ))}
                  </div>
               )}
            </div>
         </div>
         <div className={cn(!issueId ? "max-lg:hidden" : "", "flex-1")}>
            <Outlet />
         </div>
      </Main>
   )
}

function Notification({
   notification,
   ...props
}: {
   notification: Awaited<ReturnType<typeof notificationFns.list>>[number]
} & LinkProps & { onClick?: () => void }) {
   const { slug } = Route.useParams()

   return (
      <Link
         mask={{
            unmaskOnReload: true,
            to: "/$slug/issue/$issueId",
            params: {
               slug,
               issueId: notification.issueId,
            },
         }}
         to="/$slug/inbox/issue/$issueId"
         params={{
            slug,
            issueId: notification.issueId,
         }}
         className={
            "flex items-center gap-2.5 rounded-lg p-2 data-[active=true]:bg-border/60 focus:bg-border/60 hover:bg-border/40"
         }
         {...props}
      >
         <UserAvatar
            user={notification.sender}
            className="size-10 [&>[data-indicator]]:size-4"
         />
         <div className="flex-1">
            <div className="-mt-px flex w-full items-center gap-2">
               <p className="line-clamp-1 font-semibold">
                  {notification.issue.title}
               </p>
               <span className="ml-auto">
                  {notification.type === "issue_resolved" ? (
                     <StatusIcon
                        className="size-4"
                        status={notification.issue.status}
                     />
                  ) : (
                     <span className="grid size-4 place-items-center rounded-full border border-foreground/10 bg-border">
                        <Icons.plus className="size-3" />
                     </span>
                  )}
               </span>
            </div>
            <div className="flex w-full items-center gap-2">
               <p className="line-clamp-1 text-sm opacity-75">
                  {notification.content}
               </p>
               <span className="ml-auto whitespace-nowrap text-xs opacity-75">
                  {formatDate(new Date(notification.createdAt), {
                     month: "short",
                     day: "numeric",
                  })}
               </span>
            </div>
         </div>
      </Link>
   )
}
