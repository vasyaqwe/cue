import { organizationMembersQuery } from "@/organization/queries"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Icons } from "@/ui/components/icons"
import { Loading } from "@/ui/components/loading"
import { Main } from "@/ui/components/main"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/inbox")({
   component: Component,
   meta: () => [{ title: "Inbox" }],
   loader: async ({ context }) => {
      context.queryClient.prefetchQuery(
         organizationMembersQuery({ organizationId: context.organizationId }),
      )
   },
   pendingComponent: () => (
      <>
         <Header>
            <HeaderTitle>Inbox</HeaderTitle>
         </Header>
         <Main>
            <Loading className="absolute inset-0 m-auto" />
         </Main>
      </>
   ),
})

function Component() {
   return (
      <>
         <Header>
            <HeaderTitle>Inbox</HeaderTitle>
         </Header>
         <Main>
            <div className="absolute inset-0 m-auto h-fit">
               <p className="flex flex-col items-center gap-4 text-center text-foreground/75 text-lg">
                  <Icons.inbox className=" size-20" />
                  Coming soon
               </p>
            </div>
         </Main>
      </>
   )
}
