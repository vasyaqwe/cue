import { useAuth } from "@/auth/hooks"
import { issueListQuery } from "@/issue/queries"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Loading } from "@/ui/components/loading"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/")({
   component: Component,
   loader: async ({ context }) => {
      return await context.queryClient.prefetchQuery(
         issueListQuery({ organizationId: context.organizationId }),
      )
   },
   meta: () => [{ title: "Issues" }],
   pendingComponent: () => (
      <>
         <Header>
            <HeaderTitle>Issues</HeaderTitle>
         </Header>
         <main className="container">
            <Loading className="absolute inset-0 m-auto" />
         </main>
      </>
   ),
})

function Component() {
   const { organizationId } = useAuth()
   const { data: issues } = useSuspenseQuery(issueListQuery({ organizationId }))

   return (
      <>
         <Header>
            <HeaderTitle>Issues</HeaderTitle>
         </Header>
         <main className="container">
            {issues.length === 0 ? (
               <p>No issues</p>
            ) : (
               <ul>
                  {issues.map((issue) => (
                     <li key={issue.id}>{issue.title}</li>
                  ))}
               </ul>
            )}
         </main>
      </>
   )
}
