import { useAuth } from "@/auth/hooks"
import type { IssueStatus } from "@/db/schema"
import { issueListQuery } from "@/issue/queries"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Route as issueIdRoute } from "@/routes/$slug/_layout/issue/$issueId"
import { Badge } from "@/ui/components/badge"
import { Loading } from "@/ui/components/loading"
import { cn } from "@/ui/utils"
import { formatDate } from "@/utils/format"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, createFileRoute, useParams } from "@tanstack/react-router"
import type { ComponentProps } from "react"
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

const StatusIcon = ({
   status,
   className,
   ...props
}: { status: IssueStatus } & ComponentProps<"svg">) => {
   const iconProps = {
      backlog: {
         color: "var(--color-muted)",
         outerDasharray: "1.4 1.74",
         outerDashoffset: "0.65",
         innerRadius: "2",
         innerDasharray: "0 100",
      },
      todo: {
         color: "var(--color-foreground)",
         outerDasharray: "3.14 0",
         outerDashoffset: "-0.7",
         innerRadius: "2",
         innerDasharray: "0 100",
      },
      "in progress": {
         color: "#FFD60A",
         outerDasharray: "3.14 0",
         outerDashoffset: "-0.7",
         innerRadius: "2",
         innerDasharray: "6.2517693806436885 100",
      },
      done: {
         color: "var(--color-brand)",
         outerDasharray: "3.14 0",
         outerDashoffset: "-0.7",
         innerRadius: "3",
         innerDasharray: "18.84955592153876 100",
      },
   }

   const currentIcon = iconProps[status]

   return (
      <svg
         viewBox="0 0 14 14"
         fill="none"
         className={cn("size-[18px] transition-all duration-300", className)}
         {...props}
      >
         <circle
            cx="7"
            cy="7"
            r="6"
            fill="none"
            stroke={currentIcon.color}
            strokeWidth="2"
            strokeDasharray={currentIcon.outerDasharray}
            strokeDashoffset={currentIcon.outerDashoffset}
            className="transition-all duration-300"
         />
         <circle
            className="progress transition-all duration-300"
            cx="7"
            cy="7"
            r={currentIcon.innerRadius}
            fill="none"
            stroke={currentIcon.color}
            strokeWidth={status === "done" ? "6" : "4"}
            strokeDasharray={currentIcon.innerDasharray}
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         />
         {status === "done" && (
            <path
               className="icon transition-all duration-300"
               stroke="none"
               fill={currentIcon.color}
               d="M10.951 4.24896C11.283 4.58091 11.283 5.11909 10.951 5.45104L5.95104 10.451C5.61909 10.783 5.0809 10.783 4.74896 10.451L2.74896 8.45104C2.41701 8.11909 2.41701 7.5809 2.74896 7.24896C3.0809 6.91701 3.61909 6.91701 3.95104 7.24896L5.35 8.64792L9.74896 4.24896C10.0809 3.91701 10.6191 3.91701 10.951 4.24896Z"
            />
         )}
      </svg>
   )
}

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
                                 <StatusIcon
                                    className="-mt-[2px] mr-2 inline-block"
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
