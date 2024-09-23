import { useAuth } from "@/auth/hooks"
import { issueListQuery } from "@/issue/queries"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Route as issueIdRoute } from "@/routes/$slug/_layout/issue/$issueId"
import { Badge } from "@/ui/components/badge"
import { Loading } from "@/ui/components/loading"
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
                                 className="flex gap-4 px-8 hover:bg-border/25"
                              >
                                 <Link
                                    to={issueIdRoute.to}
                                    params={{ issueId: issue.id, slug }}
                                    className="flex w-full gap-4 py-2"
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
                                             new Date(issue.createdAt as Date),
                                             { month: "short", day: "numeric" },
                                          )}
                                       </span>
                                    </div>
                                 </Link>
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
