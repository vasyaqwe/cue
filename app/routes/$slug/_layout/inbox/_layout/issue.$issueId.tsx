import { commentListQuery } from "@/comment/queries"
import { IssueDetails } from "@/issue/components/issue-details"
import { issueByIdQuery } from "@/issue/queries"
import {
   Header,
   HeaderBackButton,
   HeaderTitle,
} from "@/routes/$slug/-components/header"
import { Loading } from "@/ui/components/loading"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute(
   "/$slug/_layout/inbox/_layout/issue/$issueId",
)({
   component: Component,
   loader: async ({ context, params }) => {
      const issue = await context.queryClient.ensureQueryData(
         issueByIdQuery({
            issueId: params.issueId,
            organizationId: context.organizationId,
         }),
      )
      if (!issue) throw notFound()

      context.queryClient.prefetchQuery(
         commentListQuery({
            issueId: params.issueId,
            organizationId: context.organizationId,
         }),
      )

      return issue
   },
   pendingComponent: () => (
      <div className="flex flex-1 flex-col">
         <Header className="md:pl-0">
            <HeaderBackButton />
            <HeaderTitle>Issue</HeaderTitle>
         </Header>
         <div className="flex flex-1">
            <div className="relative flex-1">
               <Loading className="absolute inset-0 m-auto" />
            </div>
            <div className={"ml-auto max-w-72 flex-1 max-xl:hidden"} />
         </div>
      </div>
   ),
})

function Component() {
   return <IssueDetails />
}
