import { IssueDetails } from "@/issue/components/issue-details"
import { issueByIdQuery } from "@/issue/queries"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
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

      return issue
   },
   pendingComponent: () => (
      <>
         <Header className="md:pl-0">
            <HeaderTitle>Issue</HeaderTitle>
         </Header>
         <Main>
            <Loading className="absolute inset-0 m-auto" />
         </Main>
      </>
   ),
   preload: false,
})

function Component() {
   return <IssueDetails />
}
