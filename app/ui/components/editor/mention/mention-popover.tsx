import { organizationMembersQuery } from "@/organization/queries"
import {
   EditorMention,
   EditorMentionList,
} from "@/ui/components/editor/mention/editor-mention"
import {
   EditorMentionEmpty,
   EditorMentionItem,
} from "@/ui/components/editor/mention/editor-mention-item"
import { Loading } from "@/ui/components/loading"
import { Popover, PopoverContent } from "@/ui/components/popover"
import { UserAvatar } from "@/ui/components/user-avatar"
import { useAuth } from "@/user/hooks"
import { useQuery } from "@tanstack/react-query"
import { forwardRef, useImperativeHandle, useState } from "react"
import { match } from "ts-pattern"

export default forwardRef<
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   any,
   {
      command: (args: {
         label: string
         userId: string
      }) => void
      clientRect: () => DOMRect
      query: string
      range: Range
   }
>(({ clientRect, query, command }, ref) => {
   const [open, setOpen] = useState(true)
   const position = clientRect()
   const { organizationId } = useAuth()
   const members = useQuery(organizationMembersQuery({ organizationId }))

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
            className="relative mt-2 h-40 min-w-56 overflow-y-auto"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            style={{
               position: "absolute",
               left: position.left,
               top: position.bottom,
            }}
         >
            {members.isPending ? (
               <Loading className="absolute inset-0 m-auto" />
            ) : (
               <EditorMention query={query}>
                  <EditorMentionEmpty>No results</EditorMentionEmpty>
                  <EditorMentionList>
                     {members.data?.map(({ user }) => (
                        <EditorMentionItem
                           key={user.name}
                           value={user.name}
                           onSelect={() =>
                              command?.({
                                 label: user.name,
                                 userId: user.id,
                              })
                           }
                        >
                           <UserAvatar
                              className="size-6 [--indicator-size:0.75rem]"
                              user={user}
                           />
                           {user.name}
                        </EditorMentionItem>
                     ))}
                  </EditorMentionList>
               </EditorMention>
            )}
         </PopoverContent>
      </Popover>
   )
})
