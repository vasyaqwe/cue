import { useLocalStorage } from "@/interactions/use-local-storage"
import { StatusIcon } from "@/issue/components/icons"
import { LabelIndicator } from "@/issue/components/label-indicator"
import { issueListQuery } from "@/issue/queries"
import {
   type IssueLabel,
   type IssueStatus,
   issueLabels,
   issueStatuses,
} from "@/issue/schema"
import { useIssueStore } from "@/issue/store"
import { popModal } from "@/modals"
import {
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalTitle,
} from "@/modals/dynamic"
import { useInsertNotification } from "@/notification/hooks/use-insert-notification"
import { Button, buttonVariants } from "@/ui/components/button"
import {
   Combobox,
   ComboboxContent,
   ComboboxItem,
   ComboboxTrigger,
} from "@/ui/components/combobox"
import { EditorContent, EditorRoot } from "@/ui/components/editor"

import { organizationTeammatesIdsQuery } from "@/organization/queries"
import {
   EditorCommand,
   EditorCommandList,
} from "@/ui/components/editor/command/editor-command"
import {
   EditorCommandEmpty,
   EditorCommandItem,
} from "@/ui/components/editor/command/editor-command-item"
import { commandItems } from "@/ui/components/editor/command/extension"
import {
   link,
   mention,
   placeholder,
   slashCommand,
   starterKit,
} from "@/ui/components/editor/extensions"
import { useEditorStore } from "@/ui/components/editor/store"
import { inputVariants } from "@/ui/components/input"
import { Loading } from "@/ui/components/loading"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { useRef } from "react"
import { toast } from "sonner"
import { match } from "ts-pattern"
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
   const sendEvent = useIssueStore().sendEvent

   const [status, setStatus] = useLocalStorage<IssueStatus>(
      "create_issue_status",
      "todo",
   )
   const [label, setLabel] = useLocalStorage<IssueLabel>(
      "create_issue_label",
      issueLabels[0],
   )

   const { insertNotification } = useInsertNotification()

   const mentionedUserIds = useEditorStore().mentionedUserIds

   const teammatesIds = useQuery(
      organizationTeammatesIdsQuery({ organizationId }),
   )

   const insertFn = useServerFn(issue.insert)
   const insert = useMutation({
      mutationFn: insertFn,
      onSuccess: (issue) => {
         sendEvent({
            type: "insert",
            issue,
            senderId: user.id,
         })

         queryClient.invalidateQueries(issueListQuery({ organizationId }))

         popModal("create_issue")

         // wait for modal to animate out
         setTimeout(() => {
            setTitle("")
            setDescription("")
         }, 100)

         toast.success("Issue created", {
            action: {
               label: "View",
               onClick: () => {
                  toast.dismiss()
                  navigate({
                     to: "/$slug/issue/$issueId",
                     params: { issueId: issue.id, slug },
                  })
               },
            },
         })

         const filteredReceiverIds =
            teammatesIds.data?.filter(
               (userId) => !mentionedUserIds.includes(userId),
            ) ?? []

         match(filteredReceiverIds)
            .with([], () => {})
            .otherwise((receiverIds) =>
               insertNotification.mutate({
                  organizationId,
                  issueId: issue.id,
                  type: "new_issue",
                  content: `New issue added by ${user.name}`,
                  issue: {
                     title: issue.title,
                     status: issue.status,
                  },
                  receiverIds,
               }),
            )

         match(mentionedUserIds)
            .with([], () => {})
            .otherwise(() =>
               insertNotification.mutate({
                  organizationId,
                  issueId: issue.id,
                  type: "issue_mention",
                  content: `${user.name} mentioned you in a new issue`,
                  issue: {
                     title: issue.title,
                     status: issue.status,
                  },
                  receiverIds: mentionedUserIds,
               }),
            )

         useEditorStore.setState({
            mentionedUserIds: [],
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
                  "!border-none !outline-none !bg-transparent h-8 rounded-none p-0 font-bold text-xl",
               )}
            />
            <EditorRoot>
               <EditorContent
                  content={description}
                  onUpdate={({ editor }) => {
                     setDescription(editor.getHTML())
                  }}
                  extensions={[
                     starterKit,
                     placeholder("Add description (press '/' for commands)"),
                     link,
                     slashCommand,
                     mention,
                  ]}
                  placeholder="Add description (press '/' for commands)"
                  editorProps={{
                     attributes: {
                        class: "md:min-h-16 min-h-72",
                     },
                  }}
               >
                  <EditorCommand>
                     <EditorCommandEmpty>No results</EditorCommandEmpty>
                     <EditorCommandList>
                        {commandItems.map((item) => (
                           <EditorCommandItem
                              value={item.title}
                              onSelect={(value) =>
                                 item.command?.(value as never)
                              }
                              key={item.title}
                           >
                              {item.icon}
                              {item.title}
                           </EditorCommandItem>
                        ))}
                     </EditorCommandList>
                  </EditorCommand>
               </EditorContent>
            </EditorRoot>
         </form>
         <ModalFooter className="gap-2 md:mt-0">
            <Combobox
               nested
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
               nested
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
