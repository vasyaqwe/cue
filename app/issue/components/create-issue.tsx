import { useInsertNotification } from "@/inbox/hooks/use-insert-notification"
import { useLocalStorage } from "@/interactions/use-local-storage"
import { StatusIcon } from "@/issue/components/icons"
import { LabelIndicator } from "@/issue/components/label-indicator"
import { useIssueSocket } from "@/issue/hooks/use-issue-socket"
import { issueListQuery } from "@/issue/queries"
import {
   type IssueLabel,
   type IssueStatus,
   issueLabels,
   issueStatuses,
} from "@/issue/schema"
import { popModal } from "@/modals"
import {
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalTitle,
} from "@/modals/dynamic"
import { Button, buttonVariants } from "@/ui/components/button"
import {
   Combobox,
   ComboboxContent,
   ComboboxItem,
   ComboboxTrigger,
} from "@/ui/components/combobox"
import { Input, inputVariants } from "@/ui/components/input"
import { Loading } from "@/ui/components/loading"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { useRef } from "react"
import { toast } from "sonner"
import * as issue from "../functions"

export function CreateIssue() {
   const queryClient = useQueryClient()
   const navigate = useNavigate()
   const { organizationId, user } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const [title, setTitle] = useLocalStorage("create_issue_title", "")
   const [description, setDescription] = useLocalStorage(
      "create_issue_description",
      "",
   )

   const titleRef = useRef<HTMLInputElement>(null)
   const { sendEvent } = useIssueSocket()

   const [status, setStatus] = useLocalStorage<IssueStatus>(
      "create_issue_status",
      "todo",
   )
   const [label, setLabel] = useLocalStorage<IssueLabel>(
      "create_issue_label",
      issueLabels[0],
   )

   const { insertNotification } = useInsertNotification()

   const insertFn = useServerFn(issue.insert)
   const insert = useMutation({
      mutationFn: insertFn,
      onSuccess: (issue) => {
         if (!issue) return

         sendEvent({
            type: "insert",
            issue,
            senderId: user.id,
         })

         queryClient.invalidateQueries(issueListQuery({ organizationId }))

         popModal("create_issue")
         setTitle("")
         setDescription("")

         toast.success("Issue created", {
            action: {
               label: "View",
               onClick: () => {
                  toast.dismiss()
                  navigate({ to: `/${slug}/issue/${issue.id}` })
               },
            },
         })

         insertNotification.mutate({
            organizationId,
            issueId: issue.id,
            type: "new_issue",
            content: `New issue added by ${user.name}`,
         })
      },
   })

   return (
      <ModalContent onAnimationEndCapture={() => titleRef.current?.focus()}>
         <ModalHeader className="max-md:hidden">
            <ModalTitle>New issue</ModalTitle>
         </ModalHeader>
         <form
            id="create_issue"
            onSubmit={(e) => {
               e.preventDefault()
               insert.mutate({
                  title,
                  description,
                  label,
                  status,
                  organizationId,
               })
            }}
            className="flex w-full flex-col p-4 pt-3"
         >
            <input
               ref={titleRef}
               autoComplete="off"
               name="title"
               id="title"
               placeholder="Issue title"
               required
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className={cn(
                  inputVariants(),
                  "!border-none !outline-none !bg-transparent h-8 p-0 font-bold text-xl",
               )}
            />
            <Input
               name="description"
               id="description"
               placeholder="Add description.."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className={
                  "!border-none !outline-none !bg-transparent mt-1 h-8 p-0 text-[1rem]"
               }
            />
         </form>
         <ModalFooter className="gap-2">
            <Combobox
               shortcut="s"
               modal
            >
               <ComboboxTrigger
                  className={cn(
                     buttonVariants({ variant: "outline" }),
                     "capitalize",
                  )}
               >
                  <StatusIcon
                     className="!size-[18px] mr-0.5"
                     status={status}
                  />
                  {status}
               </ComboboxTrigger>
               <ComboboxContent
                  align="start"
                  title="Status"
               >
                  {issueStatuses.map((s) => (
                     <ComboboxItem
                        key={s}
                        value={s}
                        onSelect={(value) => {
                           setStatus(value as never)
                        }}
                        isSelected={s === status}
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
            <Combobox
               shortcut="l"
               modal
            >
               <ComboboxTrigger
                  className={cn(
                     buttonVariants({ variant: "outline" }),
                     "capitalize",
                  )}
               >
                  <LabelIndicator label={label} />
                  {label}
               </ComboboxTrigger>
               <ComboboxContent
                  align="start"
                  title="Label"
               >
                  {issueLabels.map((l) => (
                     <ComboboxItem
                        key={l}
                        value={l}
                        onSelect={(value) => {
                           setLabel(value as never)
                        }}
                        isSelected={l === label}
                        className="capitalize"
                     >
                        <LabelIndicator label={l} />
                        {l}
                     </ComboboxItem>
                  ))}
               </ComboboxContent>
            </Combobox>
            <Button
               type="submit"
               disabled={insert.isPending || insert.isSuccess}
               form="create_issue"
               className="ml-auto"
            >
               {insert.isPending || insert.isSuccess ? (
                  <>
                     <Loading />
                     Creating..
                  </>
               ) : (
                  "Create"
               )}
            </Button>
         </ModalFooter>
      </ModalContent>
   )
}
