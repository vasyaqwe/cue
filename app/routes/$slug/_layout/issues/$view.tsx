import { IssuesPage } from "@/issue/components/issues-page"
import { issueListQuery } from "@/issue/queries"
import { isIssueView } from "@/issue/utils"
import {
   Header,
   HeaderBackButton,
   HeaderProfileDrawer,
   HeaderTitle,
} from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
import { Loading } from "@/ui/components/loading"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/issues/$view")({
   component: IssuesPage,
   params: {
      parse: (params) => {
         const view = params.view
         if (!isIssueView(view)) throw new Error(`Invalid view: ${view}`)
         return { view }
      },
      stringify: (params) => ({ view: params.view }),
   },
   onError: (error) => {
      if (error?.routerCode === "PARSE_PARAMS") throw notFound()
   },
   loader: async ({ context }) => {
      context.queryClient.prefetchQuery(
         issueListQuery({ organizationId: context.organizationId }),
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
      <Main>
         <Header>
            <HeaderBackButton />
            <HeaderTitle>Issues</HeaderTitle>
            <HeaderProfileDrawer />
         </Header>
         <main>
            <Loading className="absolute inset-0 m-auto" />
         </main>
      </Main>
   ),
})
