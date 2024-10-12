import { EditorCommandOut } from "@/ui/components/editor/command/editor-command"
import { Popover, PopoverAnchor, PopoverContent } from "@/ui/components/popover"
import type { Range } from "@tiptap/core"
import { useEffect, useRef, useState } from "react"

export function SlashCommandPopover({
   clientRect,
   query,
   range,
}: {
   clientRect: () => DOMRect
   query: string
   range: Range
}) {
   const [open, setOpen] = useState(true)
   const virtualRef = useRef({
      getBoundingClientRect: clientRect,
   })

   useEffect(() => {
      virtualRef.current.getBoundingClientRect = clientRect
   }, [clientRect])

   return (
      <Popover
         open={open}
         onOpenChange={setOpen}
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
