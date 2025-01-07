import { StatusIcon } from "@/issue/components/icons"
import { formatDateRelative } from "@/misc/format"
import type * as notificationFns from "@/notification/functions"
import { useDeleteNotifications } from "@/notification/hooks/use-delete-notifications"
import { useUpdateNotification } from "@/notification/hooks/use-update-notification"
import { notificationListQuery } from "@/notification/queries"
import { useNotificationStore } from "@/notification/store"
import {
   Header,
   HeaderBackButton,
   HeaderTitle,
} from "@/routes/$slug/-components/header"
import { Button } from "@/ui/components/button"
import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuTrigger,
} from "@/ui/components/context-menu"
import { stripHTML } from "@/ui/components/editor/utils"
import { Icons } from "@/ui/components/icons"
import { Loading } from "@/ui/components/loading"
import RefreshControl from "@/ui/components/refresh-control"
import { Tooltip } from "@/ui/components/tooltip"
import { UserAvatar } from "@/ui/components/user-avatar"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
   Link,
   Outlet,
   createFileRoute,
   useParams,
} from "@tanstack/react-router"
import type { ComponentProps } from "react"
import * as R from "remeda"
import { match } from "ts-pattern"

export const Route = createFileRoute("/$slug/_layout/inbox/_layout")({
   component: Component,
   head: () => ({
      meta: [{ title: "Inbox" }],
   }),
   loader: ({ context }) =>
      context.queryClient.ensureQueryData(
         notificationListQuery({ organizationId: context.organizationId }),
      ),
   pendingComponent: () => (
      <>
         <Header className="md:max-w-[420px] md:border-r md:pl-0">
            <HeaderBackButton />
            <HeaderTitle>Inbox</HeaderTitle>
         </Header>
         <div className="relative flex-1 border-border/75 md:max-w-[420px] md:border-r">
            <Loading className="absolute inset-0 m-auto" />
         </div>
      </>
   ),
})

function Component() {
   const { organizationId } = useAuth()
   const { issueId } = useParams({
      strict: false,
   })
   const notifications = useSuspenseQuery(
      notificationListQuery({ organizationId }),
   )
   const isRefreshing = useNotificationStore().isRefreshing
   const activeItemIssueId = useNotificationStore().activeItemIssueId

   const { updateNotification } = useUpdateNotification()

   const groupedNotifications = R.pipe(
      notifications.data,
      R.groupBy((notification) => notification.issueId),
      R.mapValues((groupedNotifications) => {
         const sortedNotifications = [...groupedNotifications].sort(
            (a, b) =>
               new Date(b.createdAt).getTime() -
               new Date(a.createdAt).getTime(),
         )

         const latestNotification = sortedNotifications[0]
         const unreadNotifications = groupedNotifications.filter(
            (n) => !n.isRead,
         )

         return {
            latestNotification,
            hasUnread: unreadNotifications.length > 0,
            unreadNotificationIds: unreadNotifications.map((n) => n.id),
         }
      }),
   )

   return (
      <div className="flex h-full flex-row">
         <div
            className={cn(
               "flex h-full flex-1 shrink-0 flex-col border-border/75 2xl:max-w-[400px] lg:max-w-[320px] lg:border-r",
               issueId ? "max-lg:hidden" : "",
            )}
         >
            <Header
               className={cn(
                  "border-r-transparent md:pl-0",
                  issueId ? "max-md:hidden" : "",
               )}
            >
               <HeaderBackButton />
               <HeaderTitle>Inbox</HeaderTitle>
               <Tooltip content={<>Mark all read</>}>
                  <Button
                     onClick={() =>
                        updateNotification.mutate({
                           data: {
                              issueIds: notifications.data
                                 .filter((n) => !n.isRead)
                                 .map((notification) => notification.issueId),
                              isRead: true,
                              organizationId,
                           },
                        })
                     }
                     size="icon"
                     variant={"ghost"}
                     disabled={
                        notifications.data.filter((n) => !n.isRead).length === 0
                     }
                     className="-mr-1 ml-auto"
                  >
                     <Icons.doubleCheck className="size-6" />
                  </Button>
               </Tooltip>
            </Header>
            <RefreshControl isRefreshing={isRefreshing}>
               <div
                  className={cn(
                     "relative flex flex-1 shrink-0 flex-col space-y-1.5 overflow-y-auto p-1.5",
                     issueId ? "max-md:hidden" : "",
                  )}
               >
                  {notifications.data.length === 0 ? (
                     <div className="absolute inset-0 m-auto h-fit">
                        <p className="flex flex-col items-center gap-4 text-center text-[#726c80] text-lg">
                           <Icons.inbox className=" size-20" />
                           Inbox is empty
                        </p>
                     </div>
                  ) : (
                     Object.values(groupedNotifications).map(
                        ({
                           latestNotification,
                           hasUnread,
                           unreadNotificationIds,
                        }) =>
                           match(latestNotification)
                              .with(undefined, () => null)
                              .otherwise((latestNotification) => (
                                 <Notification
                                    key={latestNotification.issueId}
                                    notification={{
                                       ...latestNotification,
                                       isRead: !hasUnread,
                                    }}
                                    onLinkClick={() => {
                                       useNotificationStore.setState({
                                          activeItemIssueId:
                                             latestNotification.issueId,
                                       })

                                       match(unreadNotificationIds.length)
                                          .with(0, () => {})
                                          .otherwise(() =>
                                             updateNotification.mutate({
                                                data: {
                                                   issueIds: [
                                                      latestNotification.issueId,
                                                   ],
                                                   isRead: true,
                                                   organizationId,
                                                },
                                             }),
                                          )
                                    }}
                                    data-active={
                                       activeItemIssueId ===
                                       latestNotification.issueId
                                    }
                                 />
                              )),
                     )
                  )}
               </div>
            </RefreshControl>
         </div>
         <Outlet />
      </div>
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

   const hash =
      notification.type === "new_issue_comment" ||
      notification.type === "issue_comment_mention"
         ? notification.commentId ?? ""
         : undefined

   return (
      <ContextMenu>
         <ContextMenuTrigger
            className="flex w-full items-center gap-2 rounded-xl last:mb-0 md:gap-4 data-[state=open]:bg-border/40 has-[a:focus-visible]:bg-border/60 hover:bg-border/40 md:data-[active=true]:bg-border/60"
            asChild
            {...props}
         >
            <div>
               <Link
                  preload={false}
                  mask={{
                     unmaskOnReload: true,
                     to: "/$slug/issue/$issueId",
                     params: {
                        slug,
                        issueId: notification.issueId,
                     },
                     hash,
                  }}
                  to="/$slug/inbox/issue/$issueId"
                  hash={hash}
                  params={{
                     slug,
                     issueId: notification.issueId,
                  }}
                  className={"flex w-full items-center gap-2.5 p-2 max-md:pr-0"}
                  onClick={onLinkClick}
               >
                  <UserAvatar
                     user={notification.sender}
                     className="size-9"
                     showActiveIndicator={false}
                  >
                     {match(notification.type)
                        .with("issue_resolved", () => (
                           <span className="-right-px -bottom-px absolute rounded-full outline-2 outline-background">
                              <StatusIcon
                                 className="size-4"
                                 status={"done"}
                              />
                           </span>
                        ))
                        .with("new_issue_comment", () => (
                           <span className="-right-px -bottom-px absolute grid size-4 place-items-center rounded-full border border-foreground/10 bg-border text-foreground/90 text-xl leading-[1.1] outline-2 outline-background">
                              <svg
                                 className="size-3.5"
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <path
                                    d="M5 10.4704C5 9.81626 5.13835 9.22944 5.41504 8.70996C5.69612 8.18567 6.07603 7.7696 6.55475 7.46176C7.03347 7.15392 7.57587 7 8.18196 7C8.79683 7 9.3612 7.16835 9.87506 7.50505C10.3933 7.84175 10.8083 8.32997 11.1202 8.9697C11.432 9.60462 11.5879 10.3718 11.5879 11.2713C11.5879 12.0697 11.4584 12.8033 11.1992 13.4719C10.9445 14.1405 10.5975 14.7273 10.1583 15.2323C9.84212 15.5979 9.48198 15.9202 9.07792 16.1991C8.67825 16.4733 8.25223 16.6922 7.79986 16.8557C7.65493 16.9038 7.53635 16.9399 7.44412 16.9639C7.35189 16.988 7.25087 17 7.14107 17C6.98735 17 6.86438 16.9519 6.77215 16.8557C6.67992 16.7595 6.6338 16.6368 6.6338 16.4877C6.6338 16.406 6.64698 16.3338 6.67333 16.2713C6.69968 16.2088 6.73921 16.1558 6.79191 16.1126C6.83583 16.0693 6.89512 16.0308 6.96979 15.9971C7.04884 15.9634 7.14107 15.9274 7.24648 15.8889C7.60662 15.7734 7.9448 15.6171 8.26102 15.4199C8.58163 15.2227 8.8715 14.9966 9.13062 14.7417C9.38975 14.482 9.61154 14.1982 9.796 13.8903C9.98486 13.5825 10.1276 13.2578 10.2242 12.9163H10.0463C9.77404 13.2482 9.45782 13.4983 9.09768 13.6667C8.73754 13.835 8.36203 13.9192 7.97115 13.9192C7.41337 13.9192 6.9105 13.7653 6.46252 13.4574C6.01454 13.1496 5.65879 12.7359 5.39527 12.2165C5.13176 11.6922 5 11.1101 5 10.4704ZM12.9121 10.4704C12.9121 9.81626 13.0504 9.22944 13.3271 8.70996C13.6082 8.18567 13.9881 7.7696 14.4668 7.46176C14.9456 7.15392 15.488 7 16.094 7C16.7089 7 17.2733 7.16835 17.7871 7.50505C18.3054 7.84175 18.7204 8.32997 19.0323 8.9697C19.3441 9.60462 19.5 10.3718 19.5 11.2713C19.5 12.0697 19.3704 12.8033 19.1113 13.4719C18.8566 14.1405 18.5052 14.7273 18.0572 15.2323C17.7454 15.5979 17.3875 15.9202 16.9834 16.1991C16.5837 16.4733 16.1577 16.6922 15.7054 16.8557C15.5648 16.9038 15.4462 16.9399 15.3496 16.9639C15.2574 16.988 15.1608 17 15.0597 17C14.906 17 14.7809 16.9519 14.6842 16.8557C14.5876 16.7595 14.5393 16.6368 14.5393 16.4877C14.5393 16.406 14.5525 16.3338 14.5788 16.2713C14.6096 16.2088 14.6513 16.1558 14.704 16.1126C14.7479 16.0693 14.8072 16.0308 14.8819 15.9971C14.9565 15.9634 15.0466 15.9274 15.152 15.8889C15.5121 15.7734 15.8525 15.6171 16.1731 15.4199C16.4937 15.2227 16.7836 14.9966 17.0427 14.7417C17.3018 14.482 17.5236 14.1982 17.7081 13.8903C17.8969 13.5825 18.0375 13.2578 18.1297 12.9163H17.9584C17.6817 13.2482 17.3633 13.4983 17.0032 13.6667C16.6474 13.835 16.2741 13.9192 15.8832 13.9192C15.3255 13.9192 14.8226 13.7653 14.3746 13.4574C13.9266 13.1496 13.5709 12.7359 13.3074 12.2165C13.0438 11.6922 12.9121 11.1101 12.9121 10.4704Z"
                                    fill="currentColor"
                                 />
                              </svg>
                           </span>
                        ))
                        .with("issue_mention", () => (
                           <span className="-right-px -bottom-px absolute grid size-4 place-items-center rounded-full border border-foreground/10 bg-border text-foreground/90 outline-2 outline-background">
                              <Icons.mention className="size-3.5" />
                           </span>
                        ))
                        .with("issue_comment_mention", () => (
                           <span className="-right-px -bottom-px absolute grid size-4 place-items-center rounded-full border border-foreground/10 bg-border text-foreground/90 outline-2 outline-background">
                              <Icons.mention className="size-3.5" />
                           </span>
                        ))
                        .with("new_issue", () => (
                           <span className="-right-px -bottom-px absolute grid size-4 place-items-center rounded-full border border-foreground/10 bg-border outline-2 outline-background">
                              <Icons.plus className="size-3" />
                           </span>
                        ))
                        .exhaustive()}
                  </UserAvatar>
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
                        <p className="mr-2 line-clamp-1 break-all font-semibold leading-snug">
                           {notification.issue.title}
                        </p>
                        <span className="ml-auto">
                           <StatusIcon
                              className="size-[15px]"
                              status={notification.issue.status}
                           />
                        </span>
                     </div>
                     <div className="flex w-full items-center gap-2">
                        <p
                           title={stripHTML(notification.content)}
                           className="line-clamp-1 break-all text-foreground/75 text-sm tracking-normal"
                        >
                           {notification.type === "new_issue_comment"
                              ? `${notification.sender.name} commented: `
                              : null}
                           {stripHTML(notification.content)}
                        </p>
                        <span className="ml-auto whitespace-nowrap text-foreground/75 text-xs">
                           {formatDateRelative(notification.createdAt, "narrow")
                              .replace("ago", "")
                              .replace("yesterday", "1d")}
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
                     data: {
                        issueIds: [notification.issueId],
                        isRead: !notification.isRead,
                        organizationId,
                     },
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
                     data: {
                        issueIds: [notification.issueId],
                        receiverIds: [],
                     },
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
