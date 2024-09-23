import { Header, HeaderTitle } from "@/routes/-components/header"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/$slug/settings")({
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
