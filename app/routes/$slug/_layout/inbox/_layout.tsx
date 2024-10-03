import { inboxListQuery } from "@/inbox/queries"
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
   Outlet,
   createFileRoute,
   useParams,
} from "@tanstack/react-router"

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
   const { slug } = Route.useParams()
   const { issueId } = useParams({
      strict: false,
   })
   const { data: notifications } = useSuspenseQuery(
      inboxListQuery({ organizationId }),
   )

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
                  <div className="space-y-2 p-1.5">
                     {notifications.map((notification) => (
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
                           activeProps={{
                              className: "!bg-border/55",
                           }}
                           className={
                              "flex items-center gap-2.5 rounded-lg p-2 hover:bg-border/40"
                           }
                           key={notification.id}
                        >
                           <UserAvatar
                              user={notification.sender}
                              className="size-10 [&>[data-indicator]]:size-4"
                           />
                           <div className="flex-1">
                              <p className="-mt-[3px] font-semibold">
                                 {notification.issue.title}
                              </p>
                              <div className="flex w-full items-center gap-2">
                                 <p className="line-clamp-1 text-sm opacity-75">
                                    {notification.content}
                                 </p>
                                 <span className="ml-auto whitespace-nowrap text-sm opacity-75">
                                    {formatDate(
                                       new Date(notification.createdAt),
                                       {
                                          month: "short",
                                          day: "numeric",
                                       },
                                    )}
                                 </span>
                              </div>
                           </div>
                        </Link>
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
