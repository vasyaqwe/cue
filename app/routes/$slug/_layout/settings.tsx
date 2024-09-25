import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
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
         <main className="relative h-full">Hello settings</main>
      </>
   )
}
