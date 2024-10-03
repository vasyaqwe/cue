import type * as notificationFns from "@/inbox/functions"
import { useDeleteNotification } from "@/inbox/hooks/use-delete-notification"
import { useUpdateNotification } from "@/inbox/hooks/use-update-notification"
import { inboxListQuery } from "@/inbox/queries"
import { StatusIcon } from "@/issue/components/icons"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuTrigger,
} from "@/ui/components/context-menu"
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
                           onClick={() => {
                              setActiveItemId(notification.id)
                              updateNotification.mutate({
                                 id: notification.id,
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
   ...props
}: {
   notification: Awaited<ReturnType<typeof notificationFns.list>>[number]
} & LinkProps & { onClick?: () => void }) {
   const { organizationId } = useAuth()
   const { slug } = Route.useParams()
   const { updateNotification } = useUpdateNotification()
   const { deleteNotification } = useDeleteNotification()

   return (
      <ContextMenu>
         <ContextMenuTrigger
            className="flex w-full items-center gap-2 rounded-lg p-2 md:gap-4 data-[active=true]:bg-border/60 data-[state=open]:bg-border/40 has-[a:focus-visible]:bg-border/60 hover:bg-border/40"
            asChild
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
                  {...props}
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
                     id: notification.id,
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
                  deleteNotification.mutate({
                     notificationId: notification.id,
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
