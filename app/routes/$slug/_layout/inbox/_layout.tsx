import type * as notificationFns from "@/inbox/functions"
import { useDeleteNotifications } from "@/inbox/hooks/use-delete-notification"
import { useUpdateNotification } from "@/inbox/hooks/use-update-notification"
import { inboxListQuery } from "@/inbox/queries"
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
import { Tooltip } from "@/ui/components/tooltip"
import { UserAvatar } from "@/ui/components/user-avatar"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { formatDate } from "@/utils/format"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
   Link,
   Outlet,
   createFileRoute,
   useParams,
} from "@tanstack/react-router"
import { type ComponentProps, useState } from "react"

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
                           ids: notifications
                              .filter((n) => !n.isRead)
                              .map((notification) => notification.id),
                           isRead: true,
                           organizationId,
                        })
                     }
                     size="icon"
                     variant={"ghost"}
                     disabled={
                        notifications.filter((n) => !n.isRead).length === 0
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
                  <div className="w-full space-y-1.5 p-1.5">
                     {notifications.map((notification) => (
                        <Notification
                           key={notification.id}
                           onLinkClick={() => {
                              setActiveItemId(notification.id)
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
            className="flex w-full items-center gap-2 rounded-lg p-2 md:gap-4 data-[active=true]:bg-border/60 data-[state=open]:bg-border/40 has-[a:focus-visible]:bg-border/60 hover:bg-border/40"
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
                  className={"flex w-full items-center gap-2.5"}
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
                              "-mb-px block rounded-full bg-primary transition-all duration-300",
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
                           {formatDate(new Date(notification.createdAt), {
                              month: "short",
                              day: "numeric",
                           })}
                        </span>
                     </div>
                  </div>
               </Link>
               <Icons.ellipsis className="size-7 md:hidden" />
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
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M8.99998 15.0001L12 12.0001M12 12.0001L15 9.0001M12 12.0001L8.99998 9.0001M12 12.0001L15 15.0001M11.9999 21C9.20429 21 7.80647 21 6.70384 20.5433C5.23367 19.9343 4.06563 18.7663 3.45666 17.2961C2.99994 16.1935 2.99994 14.7956 2.99994 12C2.99994 9.20435 2.99994 7.80653 3.45666 6.7039C4.06563 5.23373 5.23367 4.06569 6.70384 3.45672C7.80647 3 9.20429 3 11.9999 3C14.7956 3 16.1934 3 17.296 3.45672C18.7662 4.06569 19.9343 5.23373 20.5432 6.7039C20.9999 7.80653 20.9999 9.20435 20.9999 12C20.9999 14.7956 20.9999 16.1935 20.5432 17.2961C19.9343 18.7663 18.7662 19.9343 17.296 20.5433C16.1934 21 14.7956 21 11.9999 21Z"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                     Mark unread
                  </>
               ) : (
                  <>
                     <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M8.07257 11.0124L12.086 15.0215C13.9855 11.0964 17.0117 7.82638 20.7783 5.62919L20.9999 5.4999M20.9907 10C21 10.5774 21 11.2366 21 12C21 14.7956 21 16.1935 20.5433 17.2961C19.9343 18.7663 18.7663 19.9343 17.2961 20.5433C16.1935 21 14.7956 21 12 21C9.20435 21 7.80653 21 6.7039 20.5433C5.23373 19.9343 4.06569 18.7663 3.45672 17.2961C3 16.1935 3 14.7956 3 12C3 9.20435 3 7.80653 3.45672 6.7039C4.06569 5.23373 5.23373 4.06569 6.7039 3.45672C7.80653 3 9.20435 3 12 3C14.5517 3 15.9389 3 17 3.3473"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
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
