import type * as notificationFns from "@/inbox/functions"
import { useDeleteNotifications } from "@/inbox/hooks/use-delete-notification"
import { useUpdateNotification } from "@/inbox/hooks/use-update-notification"
import { inboxListQuery } from "@/inbox/queries"
import { useInboxStore } from "@/inbox/store"
import { StatusIcon } from "@/issue/components/icons"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
import { Button } from "@/ui/components/button"
import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuTrigger,
} from "@/ui/components/context-menu"
import { Icons } from "@/ui/components/icons"
import { Loading } from "@/ui/components/loading"
import RefreshControl from "@/ui/components/refresh-control"
import { Tooltip } from "@/ui/components/tooltip"
import { UserAvatar } from "@/ui/components/user-avatar"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { formatDateRelative } from "@/utils/format"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
   Link,
   Outlet,
   createFileRoute,
   useParams,
} from "@tanstack/react-router"
import type { ComponentProps } from "react"

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
   const notifications = useSuspenseQuery(inboxListQuery({ organizationId }))
   const isRefreshing = useInboxStore().isRefreshing
   const activeItemId = useInboxStore().activeItemId

   const { updateNotification } = useUpdateNotification()

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
               <Tooltip content={<>Mark all read</>}>
                  <Button
                     onClick={() =>
                        updateNotification.mutate({
                           ids: notifications.data
                              .filter((n) => !n.isRead)
                              .map((notification) => notification.id),
                           isRead: true,
                           organizationId,
                        })
                     }
                     size="icon"
                     variant={"ghost"}
                     disabled={
                        notifications.data.filter((n) => !n.isRead).length === 0
                     }
                     className="-mr-1 ml-auto"
                  >
                     <svg
                        className="size-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M2 13.3333C2 13.3333 3.5 14 5.5 17C5.5 17 5.78485 16.5192 6.32133 15.7526M16 6C13.7085 7.14577 11.3119 9.55181 9.3879 11.8223"
                           stroke="currentColor"
                           strokeOpacity="0.7"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                        <path
                           d="M7 13.3333C7 13.3333 8.5 14 10.5 17C10.5 17 16 8.5 21 6"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  </Button>
               </Tooltip>
            </Header>
            <RefreshControl isRefreshing={isRefreshing}>
               <div
                  className={cn(
                     "relative flex flex-1 shrink-0 overflow-y-auto",
                     issueId ? "max-md:hidden" : "",
                  )}
               >
                  {notifications.data.length === 0 ? (
                     <div className="absolute inset-0 m-auto h-fit">
                        <p className="flex flex-col items-center gap-4 text-center text-foreground/60 text-lg">
                           <Icons.inbox className=" size-20" />
                           Inbox is empty
                        </p>
                     </div>
                  ) : (
                     <div className="w-full space-y-1.5 p-1.5">
                        {notifications.data.map((notification) => (
                           <Notification
                              key={notification.id}
                              onLinkClick={() => {
                                 useInboxStore.setState({
                                    activeItemId: notification.id,
                                 })
                                 if (notification.isRead) return

                                 updateNotification.mutate({
                                    ids: [notification.id],
                                    isRead: true,
                                    organizationId,
                                 })
                              }}
                              data-active={activeItemId === notification.id}
                              notification={notification}
                           />
                        ))}
                     </div>
                  )}
               </div>
            </RefreshControl>
         </div>
         <div className={cn(!issueId ? "max-lg:hidden" : "", "flex-1")}>
            <Outlet />
         </div>
      </Main>
   )
}

function Notification({
   notification,
   onLinkClick,
   ...props
}: {
   notification: Awaited<ReturnType<typeof notificationFns.list>>[number]
} & ComponentProps<"div"> & { onLinkClick: () => void }) {
   const { organizationId } = useAuth()
   const { slug } = Route.useParams()
   const { updateNotification } = useUpdateNotification()
   const { deleteNotifications } = useDeleteNotifications()

   return (
      <ContextMenu>
         <ContextMenuTrigger
            className="flex w-full items-center gap-2 rounded-xl md:gap-4 data-[state=open]:bg-border/40 has-[a:focus-visible]:bg-border/60 hover:bg-border/40 md:data-[active=true]:bg-border/60"
            asChild
            {...props}
         >
            <div>
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
                  className={"flex w-full items-center gap-2.5 p-2 max-md:pr-0"}
                  onClick={onLinkClick}
               >
                  <UserAvatar
                     user={notification.sender}
                     className="size-10 [&>[data-indicator]]:size-4"
                  />
                  <div className="flex-1">
                     <div className="-mt-px flex w-full items-center">
                        <span
                           className={cn(
                              "-mb-px block shrink-0 rounded-full bg-primary transition-all duration-300",
                              notification.isRead
                                 ? "mr-0 size-0"
                                 : "mr-1 size-2.5",
                           )}
                        />
                        <p className="mr-2 line-clamp-1 font-semibold">
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
                           {formatDateRelative(
                              notification.createdAt,
                              "narrow",
                           ).replace("ago", "")}
                        </span>
                     </div>
                  </div>
               </Link>
               <Icons.ellipsis className="mr-1.5 size-7 md:hidden" />
            </div>
         </ContextMenuTrigger>
         <ContextMenuContent title="Notification options">
            <ContextMenuItem
               onSelect={() =>
                  updateNotification.mutate({
                     ids: [notification.id],
                     isRead: !notification.isRead,
                     organizationId,
                  })
               }
            >
               {notification.isRead ? (
                  <>
                     <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M9 15L12 12M12 12L15 9M12 12L9 9M12 12L15 15M11.9999 21.1499C6.94645 21.1499 2.84985 17.0533 2.84985 11.9999C2.84985 6.94645 6.94645 2.84985 11.9999 2.84985C17.0533 2.84985 21.1499 6.94645 21.1499 11.9999C21.1499 17.0533 17.0533 21.1499 11.9999 21.1499Z"
                           stroke="currentColor"
                           strokeWidth={2}
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                     Mark unread
                  </>
               ) : (
                  <>
                     <Icons.checkCircle />
                     Mark read
                  </>
               )}
            </ContextMenuItem>
            <ContextMenuItem
               destructive
               onSelect={() =>
                  deleteNotifications.mutate({
                     notificationIds: [notification.id],
                  })
               }
            >
               <Icons.trash />
               Delete
            </ContextMenuItem>
         </ContextMenuContent>
      </ContextMenu>
   )
}
