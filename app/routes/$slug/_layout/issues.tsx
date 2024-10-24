import { IssuesPage } from "@/issue/components/issues-page"
import { issueListQuery } from "@/issue/queries"
import {
   Header,
   HeaderBackButton,
   HeaderProfileDrawer,
   HeaderTitle,
} from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
import { Loading } from "@/ui/components/loading"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/issues")({
   component: IssuesPage,
   loader: async ({ context }) => {
      context.queryClient.prefetchQuery(
         issueListQuery({ organizationId: context.organizationId }),
      )
   },
   meta: () => [{ title: "Issues" }],
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
