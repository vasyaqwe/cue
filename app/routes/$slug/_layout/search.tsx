import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/search")({
   component: Component,
   meta: () => [{ title: "Search" }],
})

function Component() {
   return (
      <Main>
         <Header>
            <HeaderTitle>Search</HeaderTitle>
         </Header>
         <main className="relative overflow-y-auto py-5 pb-safe-4 md:py-8">
            <p className="absolute inset-0 m-auto">Search is coming soon</p>
         </main>
      </Main>
   )
}
