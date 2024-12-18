import { IssuesPage } from "@/issue/components/issues-page"
import { ViewLinks } from "@/issue/components/view-links"
import { issueListQuery } from "@/issue/queries"
import { useIssueStore } from "@/issue/store"
import { isIssueView } from "@/issue/utils"
import {
   Header,
   HeaderBackButton,
   HeaderProfileDrawer,
   HeaderTitle,
} from "@/routes/$slug/-components/header"
import { Loading } from "@/ui/components/loading"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/issues/$view")({
   component: IssuesPage,
   params: {
      parse: (params) => {
         const view = params.view
         if (!isIssueView(view)) throw new Error(`Invalid $view param: ${view}`)
         return { view }
      },
      stringify: (params) => ({ view: params.view }),
   },
   onEnter: ({ params }) => {
      useIssueStore.setState({
         lastVisitedView: params.view,
      })
   },
   onError: (error) => {
      if (error?.routerCode === "PARSE_PARAMS") throw notFound()
   },
   loader: async ({ context, params: { view } }) => {
      context.queryClient.prefetchQuery(
         issueListQuery({ organizationId: context.organizationId, view }),
      )
   },
   head: ({ params: { view } }) => ({
      meta: [
         {
            title:
               view === "all"
                  ? "All issues"
                  : view === "active"
                    ? "Active issues"
                    : "Backlog",
         },
      ],
   }),
   pendingComponent: () => (
      <>
         <Header>
            <HeaderBackButton />
            <HeaderTitle className="md:hidden">Issues</HeaderTitle>
            <ViewLinks className="-ml-2.5 max-md:hidden" />
            <HeaderProfileDrawer />
         </Header>
         <div>
            <Loading className="absolute inset-0 m-auto" />
         </div>
      </>
   ),
})
