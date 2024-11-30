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

export const Route = createFileRoute("/$slug/_layout/issue/$issueId")({
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
   head: ({ loaderData }) => ({
      meta: [{ title: loaderData?.title ?? "Issue" }],
   }),
   pendingComponent: () => (
      <>
         <Header>
            <HeaderBackButton />
            <HeaderTitle>Issue</HeaderTitle>
         </Header>
         <div className="flex flex-1">
            <div className="relative flex-1">
               <Loading className="absolute inset-0 m-auto" />
            </div>
            <div className={"ml-auto max-w-72 flex-1 max-md:hidden"} />
         </div>
      </>
   ),
   preload: false,
})

function Component() {
   return (
      <div className="relative z-[6] flex h-full w-full">
         <IssueDetails />
      </div>
   )
}
