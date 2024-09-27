import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Main } from "@/ui/components/main"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/settings")({
   component: Component,
   meta: () => [{ title: "Settings" }],
})

function Component() {
   return (
      <>
         <Header>
            <HeaderTitle>Settings</HeaderTitle>
         </Header>
         <Main>Hello settings</Main>
      </>
   )
}
