import { useAuth } from "@/auth/hooks"
import { env } from "@/env"
import { StatusIcon } from "@/issue/components/icons"
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
         <main>
            <Loading className="absolute inset-0 m-auto" />
         </main>
      </>
   ),
})

function Component() {
   const { organizationId } = useAuth()
   const { data: issues } = useSuspenseQuery(issueListQuery({ organizationId }))
   const { slug } = useParams({ from: "/$slug/_layout" })
const {copy} = useCopyToClipboard()

   const groupedIssues = R.groupBy(issues, R.prop("status"))

   return (
      <>
         <Header>
            <HeaderTitle>Issues</HeaderTitle>
         </Header>
         <main>
            {issues.length === 0 ? (
               <p>No issues</p>
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
                                          <svg
                                                   viewBox="0 0 24 24"
                                                   fill="none"
                                                   xmlns="http://www.w3.org/2000/svg"
                                                >
                                                   <path
                                                      d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.5451 16.7553C19.0673 16.2607 20.2607 15.0673 20.7553 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7553 6.45492C20.2607 4.93273 19.0673 3.73931 17.5451 3.24472C16.7919 3 15.8613 3 14 3C12.1387 3 11.2081 3 10.4549 3.24472C8.93273 3.73931 7.73931 4.93273 7.24472 6.45492C7.18049 6.65258 7.13312 6.86246 7.09819 7.09819M16.9018 16.9018C17 16.2393 17 15.3728 17 14C17 12.1387 17 11.2081 16.7553 10.4549C16.2607 8.93273 15.0673 7.73931 13.5451 7.24472C12.7919 7 11.8613 7 10 7C8.6272 7 7.76066 7 7.09819 7.09819M16.9018 16.9018C16.8669 17.1375 16.8195 17.3474 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C6.65258 7.18049 6.86246 7.13312 7.09819 7.09819"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                   />
                                                </svg>
                                             Copy
                                          </ContextMenuSubTrigger>
                                          <ContextMenuSubContent>
                                             <ContextMenuItem onSelect={() => copy(issue.title)}>
                                             <svg
                                                   viewBox="0 0 24 24"
                                                   fill="none"
                                                   xmlns="http://www.w3.org/2000/svg"
                                                >
                                                   <path
                                                      opacity="0.15"
                                                      d="M3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C6.65258 7.18049 6.86246 7.13312 7.09819 7.09819C7.76066 7 8.6272 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.3728 17 16.2393 16.9018 16.9018C16.8669 17.1375 16.8195 17.3474 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
                                                      fill="currentColor"
                                                   />
                                                   <path
                                                      d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.5451 16.7553C19.0673 16.2607 20.2607 15.0673 20.7553 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7553 6.45492C20.2607 4.93273 19.0673 3.73931 17.5451 3.24472C16.7919 3 15.8613 3 14 3C12.1387 3 11.2081 3 10.4549 3.24472C8.93273 3.73931 7.73931 4.93273 7.24472 6.45492C7.18049 6.65258 7.13312 6.86246 7.09819 7.09819M16.9018 16.9018C17 16.2393 17 15.3728 17 14C17 12.1387 17 11.2081 16.7553 10.4549C16.2607 8.93273 15.0673 7.73931 13.5451 7.24472C12.7919 7 11.8613 7 10 7C8.6272 7 7.76066 7 7.09819 7.09819M16.9018 16.9018C16.8669 17.1375 16.8195 17.3474 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C6.65258 7.18049 6.86246 7.13312 7.09819 7.09819"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                   />
                                                </svg>
                                                Copy title
                                             </ContextMenuItem>
                                             <ContextMenuItem onSelect={() => copy(`${env.VITE_BASE_URL}/${slug}/issue/${issue.id}`)}>
                                                <svg
                                                   viewBox="0 0 24 24"
                                                   fill="none"
                                                   xmlns="http://www.w3.org/2000/svg"
                                                >
                                                   <path
                                                      opacity="0.15"
                                                      d="M3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C6.65258 7.18049 6.86246 7.13312 7.09819 7.09819C7.76066 7 8.6272 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.3728 17 16.2393 16.9018 16.9018C16.8669 17.1375 16.8195 17.3474 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
                                                      fill="currentColor"
                                                   />
                                                   <path
                                                      d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.5451 16.7553C19.0673 16.2607 20.2607 15.0673 20.7553 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7553 6.45492C20.2607 4.93273 19.0673 3.73931 17.5451 3.24472C16.7919 3 15.8613 3 14 3C12.1387 3 11.2081 3 10.4549 3.24472C8.93273 3.73931 7.73931 4.93273 7.24472 6.45492C7.18049 6.65258 7.13312 6.86246 7.09819 7.09819M16.9018 16.9018C17 16.2393 17 15.3728 17 14C17 12.1387 17 11.2081 16.7553 10.4549C16.2607 8.93273 15.0673 7.73931 13.5451 7.24472C12.7919 7 11.8613 7 10 7C8.6272 7 7.76066 7 7.09819 7.09819M16.9018 16.9018C16.8669 17.1375 16.8195 17.3474 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C6.65258 7.18049 6.86246 7.13312 7.09819 7.09819"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                   />
                                                </svg>
                                                Copy URL
                                             </ContextMenuItem>
                                          </ContextMenuSubContent>
                                       </ContextMenuSub>
                                       <ContextMenuSeparator />
                                       <ContextMenuItem destructive>
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
