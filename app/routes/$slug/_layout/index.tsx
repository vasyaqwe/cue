import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/")({
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
