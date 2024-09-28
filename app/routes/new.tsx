import { CreateOrganization } from "@/organization/components/create-organization"
import { buttonVariants } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/new")({
   component: () => (
      <>
         <Link
            to="/"
            aria-label="Go back"
            className={cn(
               buttonVariants({ variant: "ghost", size: "icon" }),
               "absolute top-4 left-4 hover:bg-border/50",
            )}
            onClick={(e) => {
               e.preventDefault()
               window.history.back()
            }}
         >
            <Icons.arrowLeft />
         </Link>
         <CreateOrganization isFirstOrganization={false} />
      </>
   ),
})
