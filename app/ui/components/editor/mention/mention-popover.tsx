import { organizationMembersQuery } from "@/organization/queries"
import {
   EditorMention,
   EditorMentionList,
} from "@/ui/components/editor/mention/editor-mention"
import {
   EditorMentionEmpty,
   EditorMentionItem,
} from "@/ui/components/editor/mention/editor-mention-item"
import { Popover, PopoverContent } from "@/ui/components/popover"
import { useAuth } from "@/user/hooks"
import { useQuery } from "@tanstack/react-query"
import { forwardRef, useImperativeHandle, useState } from "react"

export default forwardRef<
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   any,
   {
      command: ({ label }: { label: string }) => void
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
         if (event.key === "ArrowUp") {
            //  upHandler()
            return true
         }

         if (event.key === "ArrowDown") {
            //  downHandler()
            return true
         }

         if (event.key === "Enter") {
            //  enterHandler()
            return true
         }

         return false
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
            className="mt-2 min-w-56"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            style={{
               position: "absolute",
               left: position.left,
               top: position.bottom,
            }}
         >
            <EditorMention query={query}>
               <EditorMentionEmpty>No results</EditorMentionEmpty>
               <EditorMentionList>
                  {members.data?.map(({ user }) => (
                     <EditorMentionItem
                        key={user.name}
                        value={user.name}
                        onSelect={() => command?.({ label: user.name })}
                     >
                        {user.name}
                     </EditorMentionItem>
                  ))}
               </EditorMentionList>
            </EditorMention>
         </PopoverContent>
      </Popover>
   )
})
