import { env } from "@/env"
import { useDeleteFavorite } from "@/favorite/hooks/use-delete-favorite"
import { useInsertFavorite } from "@/favorite/hooks/use-insert-favorite"
import { useCopyToClipboard } from "@/interactions/use-copy-to-clipboard"
import { StatusIcon } from "@/issue/components/icons"
import { LabelIndicator } from "@/issue/components/label-indicator"
import { ViewLinks } from "@/issue/components/view-links"
import { issueLabels, issueStatuses } from "@/issue/constants"
import type * as issueFns from "@/issue/functions"
import { useDeleteIssue } from "@/issue/hooks/use-delete-issue"
import { useUpdateIssue } from "@/issue/hooks/use-update-issue"
import { issueListQuery } from "@/issue/queries"
import { useIssueStore } from "@/issue/store"
import type { IssueStatus } from "@/issue/types"
import { isIssueView, isStatusActive } from "@/issue/utils"
import { formatDate } from "@/misc/format"
import {
   Header,
   HeaderBackButton,
   HeaderProfileDrawer,
   HeaderTitle,
} from "@/routes/$slug/-components/header"
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
import RefreshControl from "@/ui/components/refresh-control"
import { useAuth } from "@/user/hooks"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { memo } from "react"
import * as R from "remeda"
import { toast } from "sonner"
import { match } from "ts-pattern"

const sortOrder = [
   "in progress",
   "todo",
   "backlog",
   "done",
] satisfies IssueStatus[]

const setLastVisitedView = (node: HTMLDivElement | null) => {
   if (!node) return
   const view = node.dataset.view ?? "all"
   if (isIssueView(view)) {
      useIssueStore.setState({ lastVisitedView: view })
   }
}

export function IssuesPage() {
   const { organizationId } = useAuth()
   const { view } = useParams({ from: "/$slug/_layout/issues/$view" })
   const issues = useSuspenseQuery(
      issueListQuery({
         organizationId,
         view,
      }),
   )

   // to avoid adding/removing from query cache when updating optimistically
   const filteredIssues = issues.data.filter((issue) =>
      match(view)
         .with("active", () => isStatusActive(issue.status))
         .with("backlog", () => issue.status === "backlog")
         .with("all", () => true)
         .exhaustive(),
   )

   const groupedIssues = R.groupBy(filteredIssues, R.prop("status"))
   const sortedIssues = R.reduce<string, Record<string, typeof filteredIssues>>(
      sortOrder,
      (acc, status) => {
         if (groupedIssues[status as never]) {
            acc[status as never] = groupedIssues[status as never]
         }
         return acc
      },
      {},
   )

   const isRefreshing = useIssueStore().isRefreshing

   return (
      <>
         <div
            aria-hidden="true"
            data-view={view}
            ref={setLastVisitedView}
         />
         <Header>
            <HeaderBackButton />
            <HeaderTitle className="md:hidden">Issues</HeaderTitle>
            <ViewLinks className="-ml-2.5 max-md:hidden" />
            <HeaderProfileDrawer className="max-md:col-start-3" />
         </Header>
         <div className="overflow-y-auto">
            <ViewLinks className="border-border/75 border-b px-4 py-2 md:hidden" />
            <RefreshControl isRefreshing={isRefreshing}>
               {filteredIssues.length === 0 ? (
                  <div className="absolute inset-0 m-auto h-fit">
                     <p className="flex flex-col items-center gap-4 text-center text-[#726c80] text-lg">
                        <Icons.issues className="size-20" />
                        No issues
                     </p>
                  </div>
               ) : (
                  Object.entries(sortedIssues).map(
                     ([status, issuesArr], idx) => {
                        return (
                           <div
                              key={status}
                              data-first={idx === 0}
                              className="relative z-[2] last:[&>div:last-of-type]:border-border/75 data-[first=true]:[&>div]:border-t-transparent last:[&>div:last-of-type]:border-b max-md:last:[&>div:last-of-type]:border-b-transparent"
                           >
                              <div className="border-border/75 border-y bg-elevated py-2">
                                 <div className="px-4 md:px-8">
                                    <p className="font-semibold capitalize">
                                       <StatusIcon
                                          className="-mt-1 mr-2 inline-block"
                                          status={status as never}
                                       />
                                       {status}{" "}
                                       <span className="ml-1 opacity-75">
                                          {issuesArr.length}
                                       </span>
                                    </p>
                                 </div>
                              </div>
                              <div className={"divide-y divide-border/75"}>
                                 {issuesArr.map((issue) => (
                                    <MemoizedIssue
                                       key={issue.id}
                                       issue={issue}
                                    />
                                 ))}
                              </div>
                           </div>
                        )
                     },
                  )
               )}
            </RefreshControl>
         </div>
      </>
   )
}

function Issue({
   issue,
}: { issue: Awaited<ReturnType<typeof issueFns.list>>[number] }) {
   const { organizationId } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const { copy } = useCopyToClipboard()
   const { deleteIssue } = useDeleteIssue()
   const { updateIssue } = useUpdateIssue()

   const { insertFavorite } = useInsertFavorite()
   const { deleteFavorite } = useDeleteFavorite()

   return (
      <ContextMenu>
         <ContextMenuTrigger
            asChild
            className="flex w-full items-center gap-2 md:gap-4 data-[state=open]:bg-elevated hover:bg-elevated max-md:transition-colors"
         >
            <div className="">
               <Link
                  preload={false}
                  to={issueIdRoute.to}
                  params={{ issueId: issue.id, slug }}
                  className="flex w-full items-center gap-2 py-2 pl-4 md:gap-4 md:px-8"
               >
                  <span className="line-clamp-1 break-all text-left">
                     {issue.title}
                  </span>
                  <div className="ml-auto">
                     <Badge className="capitalize md:mr-4">
                        <LabelIndicator
                           className="mr-1.5"
                           label={issue.label}
                        />
                        {issue.label}
                     </Badge>
                     <span className="text-sm opacity-75 max-md:hidden">
                        {formatDate(new Date(issue.createdAt), {
                           month: "short",
                           day: "numeric",
                        })}
                     </span>
                  </div>
               </Link>
               <Icons.ellipsis className="mr-3 size-7 md:hidden" />
            </div>
         </ContextMenuTrigger>
         <ContextMenuContent
            className="min-w-[150px]"
            title="Issue options"
         >
            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <Icons.token />
                  Status
               </ContextMenuSubTrigger>
               <ContextMenuSubContent title="Status">
                  {issueStatuses.map((status) => (
                     <ContextMenuCheckboxItem
                        checked={status === issue.status}
                        className="capitalize"
                        key={status}
                        onSelect={() => {
                           updateIssue.mutate({
                              data: {
                                 status,
                                 organizationId,
                                 id: issue.id,
                                 title: issue.title,
                              },
                           })
                        }}
                     >
                        <StatusIcon
                           className="!size-[19px] mr-0.5 inline-block"
                           status={status}
                        />
                        {status}
                     </ContextMenuCheckboxItem>
                  ))}
               </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <Icons.tag /> Label
               </ContextMenuSubTrigger>
               <ContextMenuSubContent title="Label">
                  {issueLabels.map((label) => (
                     <ContextMenuCheckboxItem
                        checked={label === issue.label}
                        className="capitalize"
                        key={label}
                        onSelect={() => {
                           updateIssue.mutate({
                              data: {
                                 label,
                                 organizationId,
                                 id: issue.id,
                                 title: issue.title,
                              },
                           })
                        }}
                     >
                        <LabelIndicator label={label} />
                        {label}
                     </ContextMenuCheckboxItem>
                  ))}
               </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <Icons.copy className="[&>path]:first:hidden" />
                  Copy
               </ContextMenuSubTrigger>
               <ContextMenuSubContent title="Copy">
                  <ContextMenuItem
                     onSelect={() => {
                        copy(issue.title)
                        toast.success("Issue title copied to clipboard")
                     }}
                  >
                     <Icons.copy />
                     Copy title
                  </ContextMenuItem>
                  <ContextMenuItem
                     onSelect={() => {
                        copy(`${env.VITE_BASE_URL}/${slug}/issue/${issue.id}`)
                        toast.success("Issue URL copied to clipboard")
                     }}
                  >
                     <Icons.link />
                     Copy URL
                  </ContextMenuItem>
               </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem
               onSelect={() =>
                  match(issue.isFavorited)
                     .with(true, () => {
                        deleteFavorite.mutate({
                           data: {
                              entityId: issue.id,
                              entityType: "issue",
                              organizationId,
                           },
                        })
                     })
                     .otherwise(() => {
                        insertFavorite.mutate({
                           data: {
                              entityId: issue.id,
                              organizationId,
                              entityType: "issue",
                              issue: {
                                 title: issue.title,
                                 status: issue.status,
                              },
                           },
                        })
                     })
               }
            >
               <Icons.star data-fill={issue.isFavorited} />
               {issue.isFavorited ? "Unfavorite" : "Favorite"}
            </ContextMenuItem>
            <ContextMenuItem
               destructive
               onSelect={() =>
                  deleteIssue.mutate({
                     data: { issueId: issue.id, organizationId },
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

const MemoizedIssue = memo(Issue)
