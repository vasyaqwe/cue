import { useAuth } from "@/auth/hooks"
import { env } from "@/env"
import { StatusIcon } from "@/issue/components/icons"
import { useDeleteIssue, useUpdateIssue } from "@/issue/mutations"
import { issueListQuery } from "@/issue/queries"
import { issueStatuses } from "@/issue/schema"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Route as issueIdRoute } from "@/routes/$slug/_layout/issue/$issueId"
import { Badge } from "@/ui/components/badge"
import {
   ContextMenu,
   ContextMenuCheckboxItem,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuSeparator,
   ContextMenuSub,
   ContextMenuSubContent,
   ContextMenuSubTrigger,
   ContextMenuTrigger,
} from "@/ui/components/context-menu"
import { Icons } from "@/ui/components/icons"
import { Loading } from "@/ui/components/loading"
import { useCopyToClipboard } from "@/user-interactions/use-copy-to-clipboard"
import { formatDate } from "@/utils/format"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, createFileRoute, useParams } from "@tanstack/react-router"
import * as R from "remeda"
import { toast } from "sonner"

export const Route = createFileRoute("/$slug/_layout/")({
   component: Component,
   loader: async ({ context }) => {
      context.queryClient.prefetchQuery(
         issueListQuery({ organizationId: context.organizationId }),
      )
   },
   meta: () => [{ title: "Issues" }],
   pendingComponent: () => (
      <>
         <Header>
            <HeaderTitle>Issues</HeaderTitle>
         </Header>
         <main className="relative h-full">
            <Loading className="absolute inset-0 m-auto" />
         </main>
      </>
   ),
})

function Component() {
   const { organizationId } = useAuth()
   const { data: issues } = useSuspenseQuery(issueListQuery({ organizationId }))
   const { slug } = useParams({ from: "/$slug/_layout" })
   const { copy } = useCopyToClipboard()
   const { deleteIssue } = useDeleteIssue()
   const { updateIssue } = useUpdateIssue()

   const groupedIssues = R.groupBy(issues, R.prop("status"))

   return (
      <>
         <Header>
            <HeaderTitle>Issues</HeaderTitle>
         </Header>
         <main className="relative h-full">
            {issues.length === 0 ? (
               <p className="absolute inset-0 m-auto size-fit">No issues</p>
            ) : (
               Object.entries(groupedIssues).map(([status, issues]) => {
                  return (
                     <div key={status}>
                        <div className="border-border/75 border-y bg-border/25 py-2 first:border-t-transparent">
                           <div className="px-8">
                              <p className="font-semibold capitalize">
                                 <StatusIcon
                                    className="-mt-1 mr-2 inline-block"
                                    status={status as never}
                                 />
                                 {status}{" "}
                                 <span className="ml-1 opacity-75">
                                    {issues.length}
                                 </span>
                              </p>
                           </div>
                        </div>
                        <div className="divide-y divide-border/75">
                           {issues.map((issue) => (
                              <div
                                 key={issue.id}
                                 className="flex gap-4 px-8 has-data-[state=open]:bg-border/25 hover:bg-border/25"
                              >
                                 <ContextMenu>
                                    <ContextMenuTrigger asChild>
                                       <Link
                                          to={issueIdRoute.to}
                                          params={{ issueId: issue.id, slug }}
                                          className="flex w-full gap-4 py-2 "
                                       >
                                          <p className="line-clamp-1">
                                             {issue.title}
                                          </p>

                                          <div className="ml-auto">
                                             <Badge
                                                variant={issue.label}
                                                className="mr-4 capitalize"
                                             >
                                                {issue.label}
                                             </Badge>
                                             <span className=" text-sm opacity-75 max-md:hidden">
                                                {formatDate(
                                                   new Date(issue.createdAt),
                                                   {
                                                      month: "short",
                                                      day: "numeric",
                                                   },
                                                )}
                                             </span>
                                          </div>
                                       </Link>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                       <ContextMenuSub>
                                          <ContextMenuSubTrigger>
                                             <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                             >
                                                <path
                                                   d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                                                   stroke="currentColor"
                                                   strokeWidth="2"
                                                   strokeLinecap="round"
                                                   strokeLinejoin="round"
                                                />
                                                <path
                                                   d="M10.3027 9.69707C10.8967 9.10305 11.1938 8.80604 11.5362 8.69475C11.8375 8.59687 12.162 8.59687 12.4633 8.69475C12.8058 8.80604 13.1028 9.10305 13.6968 9.69707L14.3027 10.303C14.8967 10.897 15.1938 11.194 15.305 11.5365C15.4029 11.8378 15.4029 12.1623 15.305 12.4635C15.1938 12.806 14.8967 13.103 14.3027 13.6971L13.6968 14.303C13.1028 14.897 12.8058 15.194 12.4633 15.3053C12.162 15.4032 11.8375 15.4032 11.5362 15.3053C11.1938 15.194 10.8967 14.897 10.3027 14.303L9.69683 13.6971C9.1028 13.103 8.80579 12.806 8.69451 12.4635C8.59662 12.1623 8.59662 11.8378 8.69451 11.5365C8.80579 11.194 9.1028 10.897 9.69683 10.303L10.3027 9.69707Z"
                                                   stroke="currentColor"
                                                   strokeWidth="2"
                                                   strokeLinecap="round"
                                                   strokeLinejoin="round"
                                                />
                                             </svg>
                                             Status
                                          </ContextMenuSubTrigger>
                                          <ContextMenuSubContent>
                                             {issueStatuses.map((status) => (
                                                <ContextMenuCheckboxItem
                                                   checked={
                                                      status === issue.status
                                                   }
                                                   className="capitalize"
                                                   key={status}
                                                   onSelect={() => {
                                                      updateIssue.mutate({
                                                         status,
                                                         organizationId,
                                                         id: issue.id,
                                                      })
                                                   }}
                                                >
                                                   <StatusIcon
                                                      className="!size-[18px] mr-1 inline-block"
                                                      status={status}
                                                   />
                                                   {status}
                                                </ContextMenuCheckboxItem>
                                             ))}
                                          </ContextMenuSubContent>
                                       </ContextMenuSub>
                                       <ContextMenuSub>
                                          <ContextMenuSubTrigger>
                                             <Icons.copy className="[&>path]:first:hidden" />
                                             Copy
                                          </ContextMenuSubTrigger>
                                          <ContextMenuSubContent>
                                             <ContextMenuItem
                                                onSelect={() => {
                                                   copy(issue.title)
                                                   toast.success(
                                                      "Copied to clipboard",
                                                   )
                                                }}
                                             >
                                                <Icons.copy />
                                                Copy title
                                             </ContextMenuItem>
                                             <ContextMenuItem
                                                onSelect={() => {
                                                   copy(
                                                      `${env.VITE_BASE_URL}/${slug}/issue/${issue.id}`,
                                                   )
                                                   toast.success(
                                                      "Copied to clipboard",
                                                   )
                                                }}
                                             >
                                                <Icons.copy />
                                                Copy URL
                                             </ContextMenuItem>
                                          </ContextMenuSubContent>
                                       </ContextMenuSub>
                                       <ContextMenuSeparator />
                                       <ContextMenuItem
                                          destructive
                                          onSelect={() =>
                                             deleteIssue.mutate({
                                                issueId: issue.id,
                                                organizationId,
                                             })
                                          }
                                       >
                                          <Icons.trash />
                                          Delete
                                       </ContextMenuItem>
                                    </ContextMenuContent>
                                 </ContextMenu>
                              </div>
                           ))}
                        </div>
                     </div>
                  )
               })
            )}
         </main>
      </>
   )
}
