import { useAuth } from "@/auth/hooks"
import { env } from "@/env"
import { StatusIcon } from "@/issue/components/icons"
import { useDeleteIssue } from "@/issue/mutations"
import { issueListQuery } from "@/issue/queries"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Route as issueIdRoute } from "@/routes/$slug/_layout/issue/$issueId"
import { Badge } from "@/ui/components/badge"
import {
   ContextMenu,
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

   const groupedIssues = R.groupBy(issues, R.prop("status"))

   return (
      <>
         <Header>
            <HeaderTitle>Issues</HeaderTitle>
         </Header>
         <main className="relative h-full">
            {issues.length === 0 ? (
               <p className="absolute inset-0 m-auto">No issues</p>
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
                                                   new Date(
                                                      issue.createdAt as Date,
                                                   ),
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
