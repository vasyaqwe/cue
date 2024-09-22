import { Button } from "@/ui/components/button"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/$slug/settings")({
   component: Component,
})

function Component() {
   return (
      <>
         <Button variant={"outline"}>Hello settings</Button>
      </>
   )
}
