import { CreateOrganization } from "@/organization/components/create-organization"
import { organizationMembershipsQuery } from "@/organization/queries"
import { buttonVariants } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/new")({
   component: Component,
   beforeLoad: async ({ context }) => {
      await context.queryClient
         .ensureQueryData(organizationMembershipsQuery())
         .catch(() => {
            throw redirect({
               to: "/login",
            })
         })
   },
})

function Component() {
   const memberships = useSuspenseQuery(organizationMembershipsQuery())
   const hasAnOrganization = memberships.data?.length > 0

   return (
      <>
         {hasAnOrganization && (
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
         )}
         <CreateOrganization isFirstOrganization={!hasAnOrganization} />
      </>
   )
}
