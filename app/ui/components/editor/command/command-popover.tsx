import { EditorCommandOut } from "@/ui/components/editor/command/editor-command"
import { Popover, PopoverAnchor, PopoverContent } from "@/ui/components/popover"
import type { Range } from "@tiptap/core"
import { useEffect, useRef, useState } from "react"

export function SlashCommandPopover({
   clientRect,
   query,
   range,
}: {
   clientRect: () => DOMRect | undefined
   query: string
   range: Range
}) {
   const [open, setOpen] = useState(true)
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
            title="Command"
            drawerOnMobile={false}
            align="start"
            sideOffset={8}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="h-[181px] min-w-56 scroll-py-1 overflow-y-auto"
         >
            <EditorCommandOut
               query={query}
               range={range}
            />
         </PopoverContent>
      </Popover>
   )
}
