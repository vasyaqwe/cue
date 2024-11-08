import { FavoriteList } from "@/favorite/components/favorite-list"
import { useLocalStorage } from "@/interactions/use-local-storage"
import { DraftIndicator } from "@/issue/components/draft-indicator"
import { issueListQuery } from "@/issue/queries"
import { useIssueStore } from "@/issue/store"
import { pushModal } from "@/modals"
import {
   notificationListQuery,
   notificationUnreadCountQuery,
} from "@/notification/queries"
import { useNotificationStore } from "@/notification/store"
import { organizationMembershipsQuery } from "@/organization/queries"
import { Route as inboxRoute } from "@/routes/$slug/_layout/inbox/_layout/index"
import { Route as issuesRoute } from "@/routes/$slug/_layout/issues/$view"
import { Route as peopleRoute } from "@/routes/$slug/_layout/people"
import { Route as settingsRoute } from "@/routes/$slug/_layout/settings"
import { Button, buttonVariants } from "@/ui/components/button"
import { Card } from "@/ui/components/card"
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/ui/components/dropdown-menu"
import { Icons } from "@/ui/components/icons"
import { Kbd } from "@/ui/components/kbd"
import { Logo } from "@/ui/components/logo"
import { useRefreshState } from "@/ui/components/refresh-control/use-refresh-state"
import { Tooltip } from "@/ui/components/tooltip"
import { UserAvatar } from "@/ui/components/user-avatar"
import { cn } from "@/ui/utils"
import * as userFns from "@/user/functions"
import { useAuth } from "@/user/hooks"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"
import { match } from "ts-pattern"

export function Sidebar() {
   const { user } = useAuth()
   const navigate = useNavigate()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const { organization } = useAuth()
   const memberships = useSuspenseQuery(organizationMembershipsQuery())
   const unreadCount = useSuspenseQuery(
      notificationUnreadCountQuery({ organizationId: organization.id }),
   )
   const notifications = useSuspenseQuery(
      notificationListQuery({ organizationId: organization.id }),
   )
   const refreshNotifications = useRefreshState({
      isRefetching: notifications.isRefetching,
      refetch: notifications.refetch,
      onChange: (isRefreshing) =>
         useNotificationStore.setState({
            isRefreshing,
         }),
   })

   const issues = useSuspenseQuery(
      issueListQuery({ organizationId: organization.id }),
   )
   const refreshIssues = useRefreshState({
      isRefetching: issues.isRefetching,
      refetch: issues.refetch,
      onChange: (isRefreshing) =>
         useIssueStore.setState({
            isRefreshing,
         }),
   })

   const logoutFn = useServerFn(userFns.logout)
   const logout = useMutation({
      mutationFn: logoutFn,
      onSuccess: () => {
         navigate({ to: "/login" })
      },
   })

   useHotkeys("c", (e) => {
      e.preventDefault()
      pushModal("create_issue")
   })

   useHotkeys("/", (e) => {
      e.preventDefault()
      navigate({ to: "/$slug/search", params: { slug }, search: { q: "" } })
   })

   return (
      <aside className="z-[10] h-svh w-[15.5rem] max-md:hidden">
         <div className="fixed flex h-full w-[15.5rem] flex-col border-border/60 border-r p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-px">
               <DropdownMenu>
                  <DropdownMenuTrigger
                     className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start whitespace-normal px-0 pl-0.5 font-semibold text-[0.975rem]",
                     )}
                  >
                     <Logo
                        className="size-[26px]"
                        rounded
                     />
                     <span className="mr-px line-clamp-1 break-all text-left">
                        {organization.name}
                     </span>
                     <Icons.chevronDown className="mt-[2px] mr-1.5 ml-auto size-2 shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                     className="w-[199px]"
                     align="start"
                     title="Organizations"
                  >
                     <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                     <DropdownMenuGroup className="max-h-[181px] overflow-y-auto pb-1">
                        {memberships.data.map((membership) => (
                           <DropdownMenuCheckboxItem
                              checked={
                                 membership.organization.id === organization.id
                              }
                              key={membership.organization.id}
                              onSelect={() =>
                                 navigate({
                                    to: `/$slug/issues/$view`,
                                    params: {
                                       slug: membership.organization.slug,
                                       view: "all",
                                    },
                                 })
                              }
                           >
                              <span className="line-clamp-1 break-all">
                                 {membership.organization.name}
                              </span>
                           </DropdownMenuCheckboxItem>
                        ))}
                     </DropdownMenuGroup>
                     <DropdownMenuSeparator className="mt-0" />
                     <DropdownMenuItem
                        onSelect={() => navigate({ to: "/new" })}
                     >
                        <Icons.plus /> New organization
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
               <Tooltip
                  content={
                     <>
                        Search <Kbd className="ml-1">/</Kbd>
                     </>
                  }
               >
                  <Link
                     to="/$slug/search"
                     params={{
                        slug,
                     }}
                     search={{ q: "" }}
                     className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "ml-auto shrink-0 hover:bg-border/50",
                     )}
                  >
                     <Icons.search className="size-5" />
                  </Link>
               </Tooltip>
            </div>
            <Tooltip
               content={
                  <>
                     New issue <Kbd className="ml-1">C</Kbd>{" "}
                  </>
               }
            >
               <Button
                  variant={"outline"}
                  onClick={() => pushModal("create_issue")}
                  className={cn(
                     "relative w-full shrink-0 font-semibold text-[0.95rem]",
                  )}
               >
                  <Icons.pencil className="size-5" />
                  New issue
                  <DraftIndicator />
               </Button>
            </Tooltip>
            <nav className="my-4 overflow-y-auto">
               <ul className="space-y-1">
                  <li>
                     <Link
                        params={{ slug }}
                        onClick={() =>
                           useNotificationStore.setState({
                              activeItemIssueId: null,
                           })
                        }
                        activeProps={{
                           onMouseUp: () =>
                              match(refreshNotifications.isRefreshing).with(
                                 false,
                                 () => refreshNotifications.refresh(),
                              ),
                           className:
                              "!border-border/80 bg-elevated opacity-100",
                           "aria-current": "page",
                        }}
                        to={inboxRoute.to}
                        data-has-unread={unreadCount.data.count > 0}
                        className={cn(
                           "group flex h-10 items-center gap-2 rounded-[14px] border border-transparent px-2 font-semibold text-[0.95rem] leading-none opacity-75 transition-all hover:opacity-100",
                        )}
                     >
                        <Icons.inbox className="size-6" />
                        <span className="nav-link-text">Inbox</span>
                     </Link>
                  </li>
                  <li>
                     <Link
                        params={{ slug, view: "all" }}
                        activeProps={{
                           onMouseUp: () =>
                              match(refreshIssues.isRefreshing).with(
                                 false,
                                 () => refreshIssues.refresh(),
                              ),
                           className:
                              "!border-border/80 bg-elevated opacity-100",
                           "aria-current": "page",
                        }}
                        to={issuesRoute.to}
                        className={cn(
                           "group flex h-10 items-center gap-2 rounded-[14px] border border-transparent px-2 font-semibold text-[0.95rem] leading-none opacity-75 transition-all hover:opacity-100",
                        )}
                     >
                        <Icons.issues className="size-6" />
                        <span className="nav-link-text"> Issues</span>
                     </Link>
                  </li>
                  <li>
                     <Link
                        params={{ slug }}
                        activeProps={{
                           className:
                              "!border-border/80 bg-elevated opacity-100",
                           "aria-current": "page",
                        }}
                        to={peopleRoute.to}
                        className={cn(
                           "group flex h-10 items-center gap-2 rounded-[14px] border border-transparent px-2 font-semibold text-[0.95rem] leading-none opacity-75 transition-all hover:opacity-100",
                        )}
                     >
                        <Icons.people className="size-6" />
                        <span className="nav-link-text"> People</span>
                     </Link>
                  </li>
                  <li>
                     <Link
                        params={{ slug }}
                        activeProps={{
                           className:
                              "!border-border/80 bg-elevated opacity-100",
                           "aria-current": "page",
                        }}
                        to={settingsRoute.to}
                        className={cn(
                           "group flex h-10 items-center gap-2 rounded-[14px] border border-transparent px-2 font-semibold text-[0.95rem] leading-none opacity-75 transition-all hover:opacity-100",
                        )}
                     >
                        <Icons.settings className="size-6" />
                        <span className="nav-link-text"> Settings</span>
                     </Link>
                  </li>
               </ul>
               <FavoriteList />
            </nav>
            <div className="mt-auto">
               {typeof window !== "undefined" && <NotificationPermissionCard />}
               <DropdownMenu>
                  <DropdownMenuTrigger
                     className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "rounded-full",
                     )}
                  >
                     <UserAvatar
                        className="size-7"
                        user={user}
                     />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                     title="Account options"
                     align="start"
                  >
                     <DropdownMenuItem onSelect={() => logout.mutate()}>
                        <svg
                           viewBox="0 0 24 24"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              d="M9 2C5.13401 2 2 5.13401 2 9V15C2 18.866 5.13401 22 9 22C10.7922 22 12.4291 21.3252 13.6669 20.2173C14.0784 19.849 14.1135 19.2168 13.7451 18.8053C13.3768 18.3938 12.7446 18.3588 12.3331 18.7271C11.4478 19.5194 10.2812 20 9 20C6.23858 20 4 17.7614 4 15V9C4 6.23858 6.23858 4 9 4C10.2812 4 11.4478 4.48059 12.3331 5.27292C12.7446 5.64125 13.3768 5.60623 13.7451 5.1947C14.1135 4.78317 14.0784 4.15098 13.6669 3.78265C12.4291 2.67482 10.7922 2 9 2Z"
                              fill="currentColor"
                           />
                           <path
                              d="M11.8065 9.10001C11.8462 8.70512 11.6486 8.32412 11.303 8.12908C10.9573 7.93404 10.529 7.96187 10.2115 8.2C9.15874 8.98959 8.208 9.90559 7.38045 10.9269C7.12735 11.2392 7 11.6199 7 12C7 12.3801 7.12736 12.7608 7.38045 13.0731C8.208 14.0944 9.15874 15.0104 10.2115 15.8C10.529 16.0381 10.9573 16.066 11.303 15.8709C11.6486 15.6759 11.8462 15.2949 11.8065 14.9C11.7756 14.592 11.7413 14.2989 11.7081 14.0156C11.6672 13.6656 11.628 13.3304 11.5989 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H11.5989C11.628 10.6696 11.6672 10.3344 11.7081 9.98449C11.7413 9.70113 11.7756 9.40803 11.8065 9.10001Z"
                              fill="currentColor"
                           />
                        </svg>
                        Log out
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      </aside>
   )
}

function NotificationPermissionCard() {
   const [permissionStatus, setPermissionStatus] =
      useLocalStorage<NotificationPermission>(
         "cue_notification_permission_status",
         "default",
      )

   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   useEffect(() => {
      if ("Notification" in window) {
         const currentPermission = Notification.permission
         setPermissionStatus(currentPermission)
      }
   }, [])

   if (permissionStatus === "granted") return null

   return (
      <Card className="mb-3 animate-fade-in opacity-0 [--animation-delay:250ms]">
         <p className="-mt-1 text-muted-foreground text-sm">
            Cue needs your permission to enable notifications.
         </p>
         <Button
            size="sm"
            className="mt-2.5 w-full"
            onClick={async () => {
               if (!("Notification" in window))
                  return toast.error(
                     "Your browser doesn't support notifications",
                  )

               try {
                  const permission = await Notification.requestPermission()
                  setPermissionStatus(permission)
               } catch (error) {
                  console.error(
                     "Error requesting notification permission:",
                     error,
                  )
               }
            }}
         >
            Allow notifications
         </Button>
      </Card>
   )
}
