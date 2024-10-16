import { Comment } from "@/comment/components/comment"
import { CreateComment } from "@/comment/components/create-comment"
import { commentListQuery } from "@/comment/queries"
import { useCopyToClipboard } from "@/interactions/use-copy-to-clipboard"
import { StatusIcon } from "@/issue/components/icons"
import { LabelIndicator } from "@/issue/components/label-indicator"
import { useDeleteIssue } from "@/issue/hooks/use-delete-issue"
import { useUpdateIssue } from "@/issue/hooks/use-update-issue"
import { issueByIdQuery } from "@/issue/queries"
import { issueLabels, issueStatuses } from "@/issue/schema"
import { useOnPushModal } from "@/modals"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
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
   handleFileDrop,
   handleFilePaste,
} from "@/ui/components/editor/file/plugin"
import { uploadFile } from "@/ui/components/editor/file/upload"
import { MentionProvider } from "@/ui/components/editor/mention/context"
import { mention } from "@/ui/components/editor/mention/extension"
import { Icons } from "@/ui/components/icons"
import { Input } from "@/ui/components/input"
import { Kbd } from "@/ui/components/kbd"
import { Tooltip } from "@/ui/components/tooltip"
import { UserAvatar } from "@/ui/components/user-avatar"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { formatDateRelative } from "@/utils/format"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useLocation, useParams } from "@tanstack/react-router"
import type { Editor } from "@tiptap/core"
import { useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"
import { match } from "ts-pattern"

export function IssueDetails() {
   const { issueId } = useParams({ strict: false })
   if (!issueId)
      throw new Error("IssueDetails must be used in an $issueId route")

   const { organizationId } = useAuth()
   const { pathname } = useLocation()

   const query = useSuspenseQuery(issueByIdQuery({ organizationId, issueId }))
   const comments = useSuspenseQuery(
      commentListQuery({ organizationId, issueId }),
   )
   const issue = query.data
   const { deleteIssue } = useDeleteIssue()
   const { updateIssue, updateIssueInQueryData } = useUpdateIssue()

   const { copy } = useCopyToClipboard()

   const onCopyIssueUrl = () => {
      copy(window.location.href)
      toast.success("Issue URL copied to clipboard")
   }
   useHotkeys("mod+shift+c", (e) => {
      e.preventDefault()
      onCopyIssueUrl()
   })

   const titleRef = useRef<HTMLInputElement>(null)
   const descriptionRef = useRef<Editor>()

   // handle browser back button press
   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   useEffect(() => {
      if (!issue || updateIssue.isPending || pathname.includes(issueId)) return

      // input blur works reliably
      titleRef.current?.blur()

      // editor blur doesn't, so update directly
      match(descriptionRef.current?.getHTML()).when(
         (description) => description !== issue.description,
         (description) => {
            const input = {
               id: issueId,
               organizationId,
               title: issue.title,
               description,
            }
            updateIssueInQueryData({
               input,
            })
            updateIssue.mutate(input)
         },
      )
   }, [pathname])

   const [createIssueOpen, setCreateIssueOpen] = useState(false)
   useOnPushModal("create_issue", (open) => setCreateIssueOpen(open))

   const scrollRef = useRef<HTMLDivElement>(null)

   if (!issue) return null

   const onInboxPage = pathname.includes("/inbox")

   return (
      <>
         <div className="flex flex-1 flex-col">
            <Header className={onInboxPage ? "md:pl-0" : ""}>
               <HeaderTitle>Issue</HeaderTitle>
               <DropdownMenu>
                  <DropdownMenuTrigger
                     aria-label="Issue options"
                     className={cn(
                        buttonVariants({
                           variant: "ghost",
                           size: "icon",
                        }),
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
            <div className="overflow-y-auto scroll-smooth [scrollbar-gutter:stable]">
               <div className="mx-auto w-full max-w-[51rem] py-6 md:py-8">
                  <div className="px-4">
                     <Input
                        key={issueId}
                        ref={titleRef}
                        autoComplete="off"
                        defaultValue={issue.title}
                        name="title"
                        id="title"
                        placeholder="Issue title"
                        onBlur={(e) => {
                           const title = e.target.value
                           match(title).when(
                              (title) => title !== issue.title,
                              (title) => {
                                 const input = {
                                    id: issueId,
                                    organizationId,
                                    title,
                                 }
                                 updateIssueInQueryData({
                                    input,
                                 })
                                 updateIssue.mutate(input)
                              },
                           )
                        }}
                        className="!border-none !outline-none !bg-transparent h-8 rounded-none p-0 font-extrabold text-2xl"
                     />
                     <EditorRoot>
                        <MentionProvider value="issue">
                           <EditorContent
                              onCreate={({ editor }) => {
                                 descriptionRef.current = editor
                              }}
                              key={issueId}
                              className="mt-3"
                              content={issue.description}
                              onBlur={({ editor }) => {
                                 match(editor.getHTML()).when(
                                    (description) =>
                                       description !== issue.description,
                                    (description) => {
                                       const input = {
                                          id: issueId,
                                          organizationId,
                                          title: issue.title,
                                          description,
                                       }
                                       updateIssueInQueryData({
                                          input,
                                       })
                                       updateIssue.mutate(input)
                                    },
                                 )
                              }}
                              extensions={[
                                 starterKit,
                                 placeholder(
                                    "Add description (press '/' for commands)",
                                 ),
                                 link,
                                 slashCommand,
                                 mention,
                                 file,
                              ]}
                              editorProps={{
                                 handlePaste: (view, event) => {
                                    match(
                                       handleFilePaste(view, event, uploadFile),
                                    ).with(true, () => {
                                       const description = view.dom.innerHTML
                                       const input = {
                                          id: issueId,
                                          organizationId,
                                          title: issue.title,
                                          description,
                                       }
                                       updateIssueInQueryData({ input })
                                       updateIssue.mutate(input)
                                    })
                                 },
                                 handleDrop: (view, event, _slice, moved) => {
                                    match(
                                       handleFileDrop(
                                          view,
                                          event,
                                          moved,
                                          uploadFile,
                                       ),
                                    ).with(true, () => {
                                       const description = view.dom.innerHTML
                                       const input = {
                                          id: issueId,
                                          organizationId,
                                          title: issue.title,
                                          description,
                                       }
                                       updateIssueInQueryData({ input })
                                       updateIssue.mutate(input)
                                    })
                                 },
                              }}
                              placeholder="Add description (press '/' for commands)"
                           >
                              <EditorCommand>
                                 <EditorCommandEmpty>
                                    No results
                                 </EditorCommandEmpty>
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
                     <hr className="mt-7 mb-5 border-border border-t-2 border-dotted" />
                     <p className="font-semibold text-lg">Activity</p>
                     <div>
                        <div className="mt-5 mb-3 flex items-center gap-1">
                           <UserAvatar
                              className="mr-[11px] ml-0.5 size-7"
                              user={{ ...issue.author, id: issue.authorId }}
                           />
                           <div className="md:-mt-px">
                              <strong className="font-semibold text-foreground">
                                 {issue.author.name}
                              </strong>{" "}
                              <span className="text-foreground/70">
                                 created this issue{" "}
                              </span>
                              <small className="text-foreground/60 text-sm">
                                 — {formatDateRelative(issue.createdAt)}
                              </small>
                           </div>
                        </div>
                     </div>
                  </div>
                  {comments.data.map((comment) => (
                     <Comment
                        key={comment.id}
                        comment={comment}
                     />
                  ))}
               </div>
               <div
                  className="h-px w-full"
                  ref={scrollRef}
               />
            </div>
            <div className="mt-auto w-full border-border/75 border-t bg-popover px-3 py-3 shadow-[0_-1px_1px_0px_rgb(0,0,0,0.03)] xl:py-4">
               <CreateComment
                  onMutate={() =>
                     setTimeout(() => {
                        scrollRef.current?.scrollIntoView({
                           block: "end",
                           behavior: "smooth",
                        })
                     }, 100)
                  }
                  className="mx-auto w-full max-w-[49rem]"
               />
            </div>
         </div>
         <aside
            className={cn(
               "sticky top-0 flex h-svh w-72 flex-col border-border/75 border-l bg-popover px-3 py-3 shadow-sm",
               onInboxPage ? "max-xl:hidden " : " max-lg:hidden",
            )}
         >
            <div className="flex items-center justify-between">
               <p className="pl-2 font-semibold text-foreground/75">
                  Properties
               </p>
               <Tooltip
                  content={
                     <span className="flex items-center gap-2">
                        Copy issue URL
                        <span className="inline-flex items-center gap-1">
                           <Kbd>Ctrl</Kbd>
                           <Kbd className="px-0.5 py-0">
                              <Icons.shift className="h-5 w-[18px]" />
                           </Kbd>
                           <Kbd>C</Kbd>
                        </span>
                     </span>
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
         </aside>
      </>
   )
}
