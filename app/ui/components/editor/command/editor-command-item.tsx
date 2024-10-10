import { commandItemVariants } from "@/ui/components/command"
import { useEditorStore } from "@/ui/components/editor/store"
import { cn } from "@/ui/utils"
import type { Editor, Range } from "@tiptap/core"
import { useCurrentEditor } from "@tiptap/react"
import { CommandEmpty, CommandItem } from "cmdk"
import { forwardRef } from "react"
import type { ComponentProps, ComponentPropsWithoutRef } from "react"

type Props = {
   onSelect: ({
      editor,
      range,
   }: {
      editor: Editor
      range: Range
   }) => void
}

export const EditorCommandItem = forwardRef<
   HTMLDivElement,
   Props & ComponentPropsWithoutRef<typeof CommandItem>
>(({ children, onSelect, className, ...props }, ref) => {
   const { editor } = useCurrentEditor()
   const range = useEditorStore().range

   if (!editor || !range) return null

   return (
      <CommandItem
         ref={ref}
         className={cn(
            commandItemVariants(),
            "rounded-xl [&_svg]:size-5 max-md:h-11 max-md:text-base",
            className,
         )}
         {...props}
         onSelect={() => onSelect({ editor, range })}
      >
         {children}
      </CommandItem>
   )
})

export function EditorCommandEmpty({
   className,
   ...props
}: ComponentProps<typeof CommandEmpty>) {
   return (
      <CommandEmpty
         className={cn("py-6 text-center", className)}
         {...props}
      />
   )
}
