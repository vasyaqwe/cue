import { Header, HeaderTitle } from "@/routes/-components/header"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/$slug/")({
   component: Component,
})

function Component() {
   return (
      <>
         <Header>
            <HeaderTitle>Issues</HeaderTitle>
         </Header>
         <main>Hello home</main>
      </>
   )
}
