import { Header, HeaderTitle } from "@/routes/-components/header"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/settings")({
   component: Component,
})

function Component() {
   return (
      <>
         <Header>
            <HeaderTitle>Settings</HeaderTitle>
         </Header>
         <main>Hello settings</main>
      </>
   )
}
