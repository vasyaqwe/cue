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
   preload: false,
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
         <main className="mx-auto max-w-6xl px-4 pt-10 md:px-8">
            <Input
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
            <Input
               defaultValue={issue.description}
               name="description"
               id="description"
               placeholder="Add description.."
               required
               className={
                  "!border-none !outline-none !bg-transparent mt-2 h-8 p-0 text-lg"
               }
            />
         </main>
      </>
   )
}
