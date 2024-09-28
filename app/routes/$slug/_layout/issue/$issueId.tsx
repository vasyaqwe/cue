import { useAuth } from "@/auth/hooks"
import { useDeleteIssue, useUpdateIssue } from "@/issue/mutations"
import { issueByIdQuery } from "@/issue/queries"
import type { updateIssueParams } from "@/issue/schema"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { buttonVariants } from "@/ui/components/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/ui/components/dropdown-menu"
import { Icons } from "@/ui/components/icons"
import { Input } from "@/ui/components/input"
import { Loading } from "@/ui/components/loading"
import { Main } from "@/ui/components/main"
import { cn } from "@/ui/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { useRef } from "react"
import { debounce } from "remeda"
import type { z } from "zod"

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
         <Main>
            <Loading className="absolute inset-0 m-auto" />
         </Main>
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
   const { deleteIssue } = useDeleteIssue()
   const { updateIssue } = useUpdateIssue()

   const lastSavedState = useRef({
      title: issue?.title,
      description: issue?.description,
   })

   const debouncedSaveIssue = debounce(
      (updatedFields: z.infer<typeof updateIssueParams>) => {
         if (
            updatedFields.title !== lastSavedState.current.title ||
            updatedFields.description !== lastSavedState.current.description
         ) {
            const payload = {
               title: updatedFields.title,
               description: updatedFields.description,
            }

            updateIssue.mutate({
               ...payload,
               id: issueId,
               organizationId,
            })

            lastSavedState.current = payload
         }
      },
      { waitMs: 2000 },
   )

   if (!issue) return null

   return (
      <>
         <Header>
            <HeaderTitle>Issue</HeaderTitle>
            <DropdownMenu>
               <DropdownMenuTrigger
                  aria-label="Issue options"
                  className={cn(
                     buttonVariants({ variant: "ghost", size: "icon" }),
                     " ml-2",
                  )}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth="2"
                     stroke="currentColor"
                     className="size-6"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                     />
                  </svg>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  align="start"
                  title="Issue options"
               >
                  <DropdownMenuItem
                     onSelect={() => {
                        deleteIssue.mutate({ issueId, organizationId })
                     }}
                     destructive
                  >
                     <Icons.trash />
                     Delete
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </Header>
         <Main className="mx-auto max-w-6xl px-4 pt-10 md:px-8">
            <Input
               autoComplete="off"
               autoFocus
               defaultValue={issue.title}
               name="title"
               id="title"
               placeholder="Issue title"
               required
               onChange={(e) => {
                  debouncedSaveIssue.call({ ...issue, title: e.target.value })
               }}
               className="!border-none !outline-none !bg-transparent h-8 p-0 font-extrabold text-2xl"
            />
            <Input
               defaultValue={issue.description}
               name="description"
               id="description"
               placeholder="Add description.."
               required
               onChange={(e) => {
                  debouncedSaveIssue.call({
                     ...issue,
                     description: e.target.value,
                  })
               }}
               className="!border-none !outline-none !bg-transparent mt-2 h-8 p-0 text-lg"
            />
         </Main>
      </>
   )
}
