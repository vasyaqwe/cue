import { useAuth } from "@/auth/hooks"
import { issueByIdQuery } from "@/issue/queries"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Input } from "@/ui/components/input"
import { Loading } from "@/ui/components/loading"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/issue/$issueId")({
   component: Component,
   loader: async ({ context, params }) => {
      const issue = await context.queryClient.ensureQueryData(
         issueByIdQuery({
            issueId: params.issueId,
            organizationId: context.organizationId,
         }),
      )
      if (!issue) throw notFound()

      return issue
   },
   meta: ({ loaderData }) => [{ title: loaderData.title }],
   pendingComponent: () => (
      <>
         <Header>
            <HeaderTitle>Issue</HeaderTitle>
         </Header>
         <main>
            <Loading className="absolute inset-0 m-auto" />
         </main>
      </>
   ),
})

function Component() {
   const { organizationId } = useAuth()
   const { issueId } = Route.useParams()
   const { data: issue } = useSuspenseQuery(
      issueByIdQuery({ organizationId, issueId }),
   )

   // handled in loader
   if (!issue) return null

   return (
      <>
         <Header>
            <HeaderTitle>Issue</HeaderTitle>
         </Header>
         <main className="mx-auto max-w-6xl pt-10">
            <Input
               autoComplete="off"
               autoFocus
               defaultValue={issue.title}
               name="title"
               id="title"
               placeholder="Issue title"
               required
               className={
                  "!border-none !outline-none !bg-transparent h-8 p-0 font-extrabold text-2xl"
               }
            />
         </main>
      </>
   )
}
