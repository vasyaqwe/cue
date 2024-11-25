import { StatusIcon } from "@/issue/components/icons"
import { issueListQuery } from "@/issue/queries"
import type { IssueStatus } from "@/issue/types"
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
import { Loading } from "@/ui/components/loading"
import { Popover, PopoverAnchor, PopoverContent } from "@/ui/components/popover"
import { UserAvatar } from "@/ui/components/user-avatar"
import { useAuth } from "@/user/hooks"
import { useQuery } from "@tanstack/react-query"
import type { Editor } from "@tiptap/core"
import {
   forwardRef,
   useEffect,
   useImperativeHandle,
   useRef,
   useState,
} from "react"
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
      clientRect: () => DOMRect | undefined
      query: string
      range: Range
      editor: Editor
   }
>(({ clientRect, query, command }, ref) => {
   const [open, setOpen] = useState(true)
   const { organizationId } = useAuth()
   const members = useQuery(organizationMembersQuery({ organizationId }))
   const issues = useQuery(issueListQuery({ organizationId }))

   useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
         return match(event.key)
            .with("ArrowUp", "ArrowDown", "Enter", () => true)
            .otherwise(() => false)
      },
   }))

   const virtualRef = useRef({
      getBoundingClientRect: () => clientRect() ?? new DOMRect(0, 0, 0, 0),
   })

   useEffect(() => {
      virtualRef.current.getBoundingClientRect = () =>
         clientRect() ?? new DOMRect(0, 0, 0, 0)
   }, [clientRect])

   return (
      <Popover
         open={open}
         onOpenChange={setOpen}
         drawerOnMobile={false}
      >
         <PopoverAnchor virtualRef={virtualRef} />
         <PopoverContent
            drawerOnMobile={false}
            title="Command"
            sideOffset={8}
            align="start"
            className="relative h-56 w-64 scroll-py-1 overflow-y-auto"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
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
                              }}
                           >
                              <UserAvatar
                                 className="size-6 [--indicator-size:0.75rem]"
                                 user={user}
                              />
                              <span className="line-clamp-1 break-all break-all">
                                 {user.name}
                              </span>
                           </EditorMentionItem>
                        ))}
                     </EditorMentionGroup>
                     <EditorMentionSeparator />
                     <EditorMentionGroup>
                        <EditorMentionLabel>Issues</EditorMentionLabel>
                        {issues.data?.length === 0 ? (
                           <p className="mt-1 pl-2 text-foreground/75 text-sm">
                              No issues.
                           </p>
                        ) : (
                           issues.data?.map((issue) => (
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
                                 <span className="line-clamp-1 break-all break-all">
                                    {issue.title}
                                 </span>
                              </EditorMentionItem>
                           ))
                        )}
                     </EditorMentionGroup>
                  </EditorMentionList>
               </EditorMention>
            )}
         </PopoverContent>
      </Popover>
   )
})
