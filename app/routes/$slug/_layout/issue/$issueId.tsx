import { StatusIcon } from "@/issue/components/icons"
import { LabelIndicator } from "@/issue/components/label-indicator"
import { useDeleteIssue } from "@/issue/hooks/use-delete-issue"
import { useUpdateIssue } from "@/issue/hooks/use-update-issue"
import { issueByIdQuery } from "@/issue/queries"
import {
   issueLabels,
   issueStatuses,
   type updateIssueParams,
} from "@/issue/schema"
import { useOnPushModal } from "@/modals"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
import { Button, buttonVariants } from "@/ui/components/button"
import {
   Combobox,
   ComboboxContent,
   ComboboxItem,
   ComboboxTrigger,
} from "@/ui/components/combobox"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/ui/components/dropdown-menu"
import { Icons } from "@/ui/components/icons"
import { Input } from "@/ui/components/input"
import { Kbd } from "@/ui/components/kbd"
import { Loading } from "@/ui/components/loading"
import { Tooltip } from "@/ui/components/tooltip"
import { cn } from "@/ui/utils"
import { useCopyToClipboard } from "@/user-interactions/use-copy-to-clipboard"
import { useAuth } from "@/user/hooks"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { debounce } from "remeda"
import { toast } from "sonner"
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

   const { copy } = useCopyToClipboard()

   const onCopyIssueUrl = () => {
      copy(window.location.href)
      toast.success("Issue URL copied to clipboard")
   }
   useHotkeys("mod+shift+c", (e) => {
      e.preventDefault()
      onCopyIssueUrl()
   })

   const [createIssueOpen, setCreateIssueOpen] = useState(false)
   useOnPushModal("create_issue", (open) => setCreateIssueOpen(open))

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
                     "ml-2",
                  )}
               >
                  <Icons.ellipsis className="size-6" />
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
         <Main className="flex">
            <div className="mx-auto w-full max-w-5xl px-4 pt-10 md:px-8">
               <Input
                  autoComplete="off"
                  autoFocus
                  defaultValue={issue.title}
                  name="title"
                  id="title"
                  placeholder="Issue title"
                  required
                  onChange={(e) => {
                     debouncedSaveIssue.call({
                        ...issue,
                        title: e.target.value,
                     })
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
            </div>
            <aside className="z-[3] w-72 max-md:hidden">
               <div className="fixed top-0 right-0 flex h-svh w-72 flex-col border-border/75 border-l bg-popover px-3 py-3 shadow-sm">
                  <div className="flex items-center justify-between">
                     <p className="pl-2 font-semibold text-foreground/75">
                        Properties
                     </p>
                     <Tooltip
                        content={
                           <div className="flex items-center gap-2">
                              Copy issue URL
                              <div className="inline-flex items-center gap-1">
                                 <Kbd>Ctrl</Kbd>
                                 <Kbd className="px-0.5 py-0">
                                    <Icons.shift className="h-5 w-[18px]" />
                                 </Kbd>
                                 <Kbd>C</Kbd>
                              </div>
                           </div>
                        }
                     >
                        <Button
                           onClick={onCopyIssueUrl}
                           aria-label="Copy issue URL"
                           variant={"ghost"}
                           size={"icon"}
                        >
                           <Icons.link />
                        </Button>
                     </Tooltip>
                  </div>
                  <Combobox shortcut={!createIssueOpen ? "s" : undefined}>
                     <ComboboxTrigger
                        className={cn(
                           buttonVariants({ variant: "ghost" }),
                           "mt-3 w-fit pr-2 pl-1.5 capitalize",
                        )}
                     >
                        <StatusIcon
                           className="!size-[18px] mr-0.5"
                           status={issue.status}
                        />
                        {issue.status}
                     </ComboboxTrigger>
                     <ComboboxContent
                        align="start"
                        side="left"
                        title="Status"
                     >
                        {issueStatuses.map((s) => (
                           <ComboboxItem
                              key={s}
                              value={s}
                              onSelect={(value) => {
                                 updateIssue.mutate({
                                    id: issueId,
                                    organizationId,
                                    status: value as never,
                                    title: issue.title,
                                 })
                              }}
                              isSelected={s === issue.status}
                              className="capitalize"
                           >
                              <StatusIcon
                                 className="!size-[18px] mr-0.5"
                                 status={s}
                              />
                              {s}
                           </ComboboxItem>
                        ))}
                     </ComboboxContent>
                  </Combobox>
                  <Combobox shortcut={!createIssueOpen ? "l" : undefined}>
                     <ComboboxTrigger
                        className={cn(
                           buttonVariants({ variant: "ghost" }),
                           "mt-3 w-fit pr-2 pl-2 capitalize",
                        )}
                     >
                        <LabelIndicator label={issue.label} />
                        {issue.label}
                     </ComboboxTrigger>
                     <ComboboxContent
                        align="start"
                        side="left"
                        title="Label"
                     >
                        {issueLabels.map((l) => (
                           <ComboboxItem
                              key={l}
                              value={l}
                              onSelect={(value) => {
                                 updateIssue.mutate({
                                    id: issueId,
                                    organizationId,
                                    label: value as never,
                                    title: issue.title,
                                 })
                              }}
                              isSelected={l === issue.label}
                              className="capitalize"
                           >
                              <LabelIndicator label={l} />
                              {l}
                           </ComboboxItem>
                        ))}
                     </ComboboxContent>
                  </Combobox>
               </div>
            </aside>
         </Main>
      </>
   )
}
