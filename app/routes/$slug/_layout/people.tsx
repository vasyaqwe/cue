import { useAuth } from "@/auth/hooks"
import { organizationMembersQuery } from "@/organization/queries"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Button } from "@/ui/components/button"
import { Loading } from "@/ui/components/loading"
import { UserAvatar } from "@/ui/components/user-avatar"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/people")({
   component: Component,
   meta: () => [{ title: "People" }],
   loader: async ({ context }) => {
      context.queryClient.prefetchQuery(
         organizationMembersQuery({ organizationId: context.organizationId }),
      )
   },
   pendingComponent: () => (
      <>
         <Header>
            <HeaderTitle>Issues</HeaderTitle>
         </Header>
         <main className="relative h-full">
            <Loading className="absolute inset-0 m-auto" />
         </main>
      </>
   ),
})

function Component() {
   const { organizationId } = useAuth()
   const { data: members } = useSuspenseQuery(
      organizationMembersQuery({ organizationId }),
   )

   return (
      <>
         <Header>
            <HeaderTitle>People</HeaderTitle>
         </Header>
         <main className="relative h-full">
            {members.length === 0 ? (
               <p className="absolute inset-0 m-auto">No members</p>
            ) : (
               <div className="mx-auto mt-8 flex max-w-3xl flex-col">
                  <Button
                     variant={"secondary"}
                     className="mx-auto"
                  >
                     Invite your team
                  </Button>
                  <div className="container mt-6 space-y-3">
                     {members.map((member) => (
                        <div key={member.user.email}>
                           <div className="flex items-center gap-3">
                              <UserAvatar
                                 className="size-11 [&>[data-indicator]]:size-4"
                                 user={member.user}
                              />
                              <div>
                                 <p className="line-clamp-1 font-semibold">
                                    {member.user.name}
                                 </p>
                                 <p className="line-clamp-1 opacity-75">
                                    {member.user.email}
                                 </p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </main>
      </>
   )
}
