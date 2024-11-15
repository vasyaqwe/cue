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
import { organizationTeammatesIdsQuery } from "@/organization/queries"
import { Button, buttonVariants } from "@/ui/components/button"
import {
   Combobox,
   ComboboxContent,
   ComboboxItem,
   ComboboxTrigger,
} from "@/ui/components/combobox"
import { EditorContent, EditorRoot } from "@/ui/components/editor"
import {
   EditorCommand,
   EditorCommandList,
} from "@/ui/components/editor/command/editor-command"
import {
   EditorCommandEmpty,
   EditorCommandItem,
} from "@/ui/components/editor/command/editor-command-item"
import { slashCommand } from "@/ui/components/editor/command/extension"
import { commandItems } from "@/ui/components/editor/command/items"
import {
   link,
   placeholder,
   starterKit,
} from "@/ui/components/editor/extensions"
import { file } from "@/ui/components/editor/file/extension"
import {
   onFileDrop,
   onFileInputChange,
   onFilePaste,
} from "@/ui/components/editor/file/plugin"
import { uploadFile } from "@/ui/components/editor/file/upload"
import { MentionProvider } from "@/ui/components/editor/mention/context"
import { mention } from "@/ui/components/editor/mention/extension"
import { useEditorStore } from "@/ui/components/editor/store"
import { isOnFirstLine } from "@/ui/components/editor/utils"
import {
   FILE_TRIGGER_HOTKEY,
   FileTrigger,
   FileTriggerTooltipContent,
} from "@/ui/components/file-trigger"
import { Icons } from "@/ui/components/icons"
import { Input } from "@/ui/components/input"
import { Kbd } from "@/ui/components/kbd"
import { Loading } from "@/ui/components/loading"
import { Tooltip } from "@/ui/components/tooltip"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import type { Editor } from "@tiptap/core"
import { useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"
import { match } from "ts-pattern"
import * as issue from "../functions"

export function CreateIssue() {
   const queryClient = useQueryClient()
   const navigate = useNavigate()
   const { organizationId, user } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const [title, setTitle] = useLocalStorage(`create_issue_title_${slug}`, "")
   const [description, setDescription] = useLocalStorage(
      `create_issue_description_${slug}`,
      "",
   )

   const titleRef = useRef<HTMLInputElement>(null)
   const sendEvent = useIssueStore().sendEvent

   const [status, setStatus] = useLocalStorage<IssueStatus>(
      `create_issue_status_${slug}`,
      "todo",
   )
   const [label, setLabel] = useLocalStorage<IssueLabel>(
      `create_issue_label_${slug}`,
      issueLabels[0],
   )

   const { insertNotification } = useInsertNotification()

   const mentionedUserIds = useEditorStore().getMentionedUserIds("issue")
   const clearMentions = useEditorStore().clearMentions

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
         }, 150)

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

         match(
            teammatesIds.data?.filter(
               (userId) => !mentionedUserIds.includes(userId),
            ) ?? [],
         )
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

         clearMentions("issue")
      },
   })

   const descriptionRef = useRef<Editor>()

   const fileTriggerRef = useRef<HTMLButtonElement>(null)
   useHotkeys(FILE_TRIGGER_HOTKEY, () => fileTriggerRef.current?.click(), {
      enableOnContentEditable: true,
      enableOnFormTags: true,
   })

   return (
      <ModalContent className="max-w-xl">
         <ModalHeader className="max-md:hidden">
            <ModalTitle>New issue</ModalTitle>
         </ModalHeader>
         <form
            id="create_issue"
            onSubmit={(e) => {
               e.preventDefault()
               if (title.trim().length === 0) {
                  toast.error("Title is required")
                  return true
               }
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
            <Input
               ref={titleRef}
               autoComplete="off"
               name="title"
               id="title"
               placeholder="Issue title"
               required
               disabled={insert.isPending || insert.isSuccess}
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className={cn(
                  "!border-none !outline-none !bg-transparent h-8 rounded-none p-0 font-bold text-xl",
               )}
               onKeyDown={(e) =>
                  match(e)
                     .with({ key: "Enter", ctrlKey: false }, () => {
                        e.preventDefault()
                        descriptionRef.current?.commands.focus()
                     })
                     .with({ key: "ArrowDown" }, () => {
                        e.preventDefault()
                        descriptionRef.current?.commands.focus()
                     })
               }
            />
            <EditorRoot>
               <MentionProvider value="issue">
                  <EditorContent
                     onCreate={({ editor }) => {
                        descriptionRef.current = editor
                     }}
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
                        file(),
                     ]}
                     placeholder="Add description (press '/' for commands)"
                     editorProps={{
                        editable: () => !(insert.isPending || insert.isSuccess),

                        handlePaste: (view, event) => {
                           match(onFilePaste(view, event, uploadFile)).with(
                              true,
                              () => setDescription(view.dom.innerHTML),
                           )
                        },
                        handleDrop: (view, event, _slice, moved) => {
                           match(
                              onFileDrop(view, event, moved, uploadFile),
                           ).with(true, () =>
                              setDescription(view.dom.innerHTML),
                           )
                        },
                        handleKeyDown: (view, e) => {
                           return match(e)
                              .with(
                                 {
                                    key: "Enter",
                                    ctrlKey: true,
                                 },
                                 {
                                    key: "Enter",
                                    metaKey: true,
                                 },
                                 () => {
                                    if (title.trim().length === 0) {
                                       toast.error("Title is required")
                                       return true
                                    }
                                    insert.mutate({
                                       title,
                                       description,
                                       label,
                                       status,
                                       organizationId,
                                    })
                                    return true
                                 },
                              )
                              .with({ key: "ArrowUp" }, () => {
                                 if (!isOnFirstLine(view)) return false
                                 titleRef.current?.focus()
                                 titleRef.current?.setSelectionRange(
                                    titleRef.current?.value.length,
                                    titleRef.current?.value.length,
                                 )
                                 return true
                              })
                              .otherwise(() => false)
                        },
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
               </MentionProvider>
            </EditorRoot>
            <Tooltip content={<FileTriggerTooltipContent />}>
               <FileTrigger
                  type="button"
                  size="icon"
                  variant={"ghost"}
                  ref={fileTriggerRef}
                  onChange={(e) => {
                     const view = descriptionRef.current?.view
                     if (!view) return

                     onFileInputChange(view, e, uploadFile)
                  }}
                  className="mt-3"
               >
                  <Icons.paperClip className="size-5 opacity-80" />
               </FileTrigger>
            </Tooltip>
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
            <Tooltip
               content={
                  <span className="flex items-center gap-2">
                     Create issue
                     <span className="inline-flex items-center gap-1">
                        <Kbd>Ctrl</Kbd>
                        <Kbd>Enter</Kbd>
                     </span>
                  </span>
               }
            >
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
            </Tooltip>
         </ModalFooter>
      </ModalContent>
   )
}
