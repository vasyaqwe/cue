import { useInsertComment } from "@/comment/hooks/use-insert-comment"
import { useCommentStore } from "@/comment/store"
import { issueByIdQuery } from "@/issue/queries"
import { useOnPushModal } from "@/modals"
import { Button } from "@/ui/components/button"
import { cardVariants } from "@/ui/components/card"
import { EditorContent, EditorRoot } from "@/ui/components/editor"
import {
   EditorCommand,
   EditorCommandList,
} from "@/ui/components/editor/command/editor-command"
import {
   EditorCommandEmpty,
   EditorCommandItem,
} from "@/ui/components/editor/command/editor-command-item"
import {
   commandItems,
   slashCommand,
} from "@/ui/components/editor/command/extension"
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
import {
   FILE_TRIGGER_HOTKEY,
   FileTrigger,
   FileTriggerTooltipContent,
} from "@/ui/components/file-trigger"
import { Icons } from "@/ui/components/icons"
import { Kbd } from "@/ui/components/kbd"
import { Tooltip } from "@/ui/components/tooltip"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import type { Editor } from "@tiptap/core"
import { type ComponentProps, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { match } from "ts-pattern"

export function CreateComment({
   onMutate,
   className,
   ...props
}: ComponentProps<"form"> & { onMutate?: () => void }) {
   const { issueId } = useParams({ strict: false })
   if (!issueId)
      throw new Error("CreateComment must be used in an $issueId route")

   const { organizationId, user } = useAuth()

   const issue = useSuspenseQuery(issueByIdQuery({ organizationId, issueId }))

   const [content, setContent] = useState("")

   const { insertComment } = useInsertComment({
      onMutate,
      issue: issue?.data
         ? {
              title: issue.data.title,
              status: issue.data.status,
           }
         : undefined,
   })

   const formRef = useRef<HTMLFormElement>(null)
   const editorRef = useRef<Editor>()

   const createCommentEditorFocused =
      useCommentStore().createCommentEditorFocused
   const [createIssueOpen, setCreateIssueOpen] = useState(false)
   useOnPushModal("create_issue", (open) => setCreateIssueOpen(open))
   const fileTriggerRef = useRef<HTMLButtonElement>(null)
   useHotkeys(FILE_TRIGGER_HOTKEY, () => fileTriggerRef.current?.click(), {
      enabled: createCommentEditorFocused && !createIssueOpen,
      enableOnContentEditable: true,
   })

   const isEmpty = content.trim() === ""

   if (!issue?.data) return null

   return (
      <form
         ref={formRef}
         className={cn(
            cardVariants(),
            "max-h-[50svh] overflow-y-auto border-border/45 p-0 pt-0 transition-colors has-focus:border-border",
            className,
         )}
         onSubmit={(e) => {
            e.preventDefault()
            insertComment.mutate({
               content,
               authorId: user.id,
               issueId,
               organizationId,
            })
            editorRef.current?.commands.clearContent()
            setContent("")
         }}
         {...props}
      >
         <EditorRoot>
            <MentionProvider value="comment">
               <EditorContent
                  onFocus={() =>
                     useCommentStore.setState({
                        createCommentEditorFocused: true,
                     })
                  }
                  onBlur={() =>
                     useCommentStore.setState({
                        createCommentEditorFocused: false,
                     })
                  }
                  onCreate={({ editor }) => {
                     editorRef.current = editor
                  }}
                  content={content}
                  onUpdate={({ editor }) => {
                     setContent(editor.getHTML())
                  }}
                  className="p-3 py-0"
                  extensions={[
                     starterKit,
                     placeholder("Leave a comment.."),
                     link,
                     slashCommand,
                     mention,
                     file(),
                  ]}
                  placeholder="Leave a comment.."
                  editorProps={{
                     handlePaste: (view, event) => {
                        match(onFilePaste(view, event, uploadFile)).with(
                           true,
                           () => setContent(view.dom.innerHTML),
                        )
                     },
                     handleDrop: (view, event, _slice, moved) => {
                        match(onFileDrop(view, event, moved, uploadFile)).with(
                           true,
                           () => setContent(view.dom.innerHTML),
                        )
                     },
                     handleKeyDown: (_view, e) => {
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
                                 formRef.current?.requestSubmit()
                                 return true
                              },
                           )
                           .otherwise(() => false)
                     },
                     attributes: {
                        class: "md:min-h-12",
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
         <div className="sticky bottom-0 flex items-center gap-2 bg-secondary p-3 pt-1">
            <Tooltip
               alignOffset={-7}
               align="start"
               content={<FileTriggerTooltipContent />}
            >
               <FileTrigger
                  type="button"
                  size="icon"
                  variant={"ghost"}
                  ref={fileTriggerRef}
                  onChange={(e) => {
                     const view = editorRef.current?.view
                     if (!view) return

                     onFileInputChange(view, e, uploadFile)
                  }}
               >
                  <Icons.paperClip className="size-5 opacity-80" />
               </FileTrigger>
            </Tooltip>
            <Tooltip
               alignOffset={-7}
               align="end"
               content={
                  <span className="flex items-center gap-2">
                     Submit
                     <span className="inline-flex items-center gap-1">
                        <Kbd>Ctrl</Kbd> <Kbd>Enter</Kbd>
                     </span>
                  </span>
               }
            >
               <Button
                  disabled={isEmpty}
                  aria-label="Submit comment"
                  size="icon"
                  className="ml-auto"
               >
                  <Icons.arrowUp className="size-5" />
               </Button>
            </Tooltip>
         </div>
      </form>
   )
}
