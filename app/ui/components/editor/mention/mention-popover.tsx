import { StatusIcon } from "@/issue/components/icons"
import { issueListQuery } from "@/issue/queries"
import type { IssueStatus } from "@/issue/schema"
import { organizationMembersQuery } from "@/organization/queries"
import {
   EditorMention,
   EditorMentionGroup,
   EditorMentionLabel,
   EditorMentionList,
   EditorMentionSeparator,
} from "@/ui/components/editor/mention/editor-mention"
import {
   EditorMentionEmpty,
   EditorMentionItem,
} from "@/ui/components/editor/mention/editor-mention-item"
import { getMentionedUserIds } from "@/ui/components/editor/mention/utils"
import { useEditorStore } from "@/ui/components/editor/store"
import { Loading } from "@/ui/components/loading"
import { Popover, PopoverContent } from "@/ui/components/popover"
import { UserAvatar } from "@/ui/components/user-avatar"
import { useAuth } from "@/user/hooks"
import { useQuery } from "@tanstack/react-query"
import type { Editor } from "@tiptap/core"
import { forwardRef, useImperativeHandle, useState } from "react"
import { match } from "ts-pattern"

export default forwardRef<
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   any,
   {
      command: (args: {
         label: string
         userId?: string | undefined
         issueId?: string | undefined
         status?: IssueStatus | undefined
      }) => void
      clientRect: () => DOMRect
      query: string
      range: Range
      editor: Editor
   }
>(({ clientRect, query, command, editor }, ref) => {
   const [open, setOpen] = useState(true)
   const position = clientRect()
   const { organizationId, user: currentUser } = useAuth()
   const members = useQuery(organizationMembersQuery({ organizationId }))
   const issues = useQuery(issueListQuery({ organizationId }))

   const addMentionedUserId = useEditorStore().addMentionedUserId

   useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
         return match(event.key)
            .with("ArrowUp", "ArrowDown", "Enter", () => true)
            .otherwise(() => false)
      },
   }))

   return (
      <Popover
         open={open}
         onOpenChange={setOpen}
         drawerOnMobile={false}
      >
         <PopoverContent
            drawerOnMobile={false}
            title="Command"
            container={document.body}
            side="bottom"
            align="start"
            className="relative mt-2 h-56 w-64 scroll-py-1 overflow-y-auto"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            style={{
               position: "absolute",
               left: position.left,
               top: position.bottom,
            }}
         >
            {members.isPending || issues.isPending ? (
               <Loading className="absolute inset-0 m-auto" />
            ) : members.isError || issues.isError ? (
               <>
                  <p className="text-foreground/75">
                     Something went wrong. Please try again later.
                  </p>
               </>
            ) : (
               <EditorMention query={query}>
                  <EditorMentionEmpty>No results</EditorMentionEmpty>
                  <EditorMentionList>
                     <EditorMentionGroup>
                        <EditorMentionLabel>People</EditorMentionLabel>
                        {members.data?.map(({ user }) => (
                           <EditorMentionItem
                              key={user.name}
                              value={user.name}
                              onSelect={() => {
                                 command?.({
                                    label: user.name,
                                    userId: user.id,
                                 })

                                 const existingMentionedUserIds =
                                    getMentionedUserIds(
                                       editor.getHTML(),
                                    ).filter((id) => id === user.id)
                                 const userAlreadyMentioned =
                                    existingMentionedUserIds.length > 1

                                 if (
                                    currentUser.id === user.id ||
                                    userAlreadyMentioned
                                 )
                                    return

                                 addMentionedUserId(user.id)
                              }}
                           >
                              <UserAvatar
                                 className="size-6 [--indicator-size:0.75rem]"
                                 user={user}
                              />
                              <span className="line-clamp-1 break-all">
                                 {user.name}
                              </span>
                           </EditorMentionItem>
                        ))}
                     </EditorMentionGroup>
                     <EditorMentionSeparator />
                     <EditorMentionGroup>
                        <EditorMentionLabel>Issues</EditorMentionLabel>
                        {issues.data?.map((issue) => (
                           <EditorMentionItem
                              key={issue.id}
                              value={`${issue.title} ${issue.id}`}
                              onSelect={() => {
                                 command?.({
                                    label: issue.title,
                                    issueId: issue.id,
                                    status: issue.status,
                                 })
                              }}
                           >
                              <StatusIcon
                                 className="!size-[18px]"
                                 status={issue.status}
                              />
                              <span className="line-clamp-1 break-all">
                                 {issue.title}
                              </span>
                           </EditorMentionItem>
                        ))}
                     </EditorMentionGroup>
                  </EditorMentionList>
               </EditorMention>
            )}
         </PopoverContent>
      </Popover>
   )
})
