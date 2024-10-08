import { commandItemVariants } from "@/ui/components/command"
import { useEditorStore } from "@/ui/components/editor/store"
import { cn } from "@/ui/utils"
import type { Editor, Range } from "@tiptap/core"
import { useCurrentEditor } from "@tiptap/react"
import { CommandEmpty, CommandItem } from "cmdk"
import { forwardRef } from "react"
import type { ComponentProps, ComponentPropsWithoutRef } from "react"

type EditorCommandItemProps = {
   readonly onSelect: ({
      editor,
      range,
   }: {
      editor: Editor
      range: Range
   }) => void
}

export const EditorCommandItem = forwardRef<
   HTMLDivElement,
   EditorCommandItemProps & ComponentPropsWithoutRef<typeof CommandItem>
>(({ children, onSelect, className, ...props }, ref) => {
   const { editor } = useCurrentEditor()
   const range = useEditorStore().range

   if (!editor || !range) return null

   return (
      <CommandItem
         ref={ref}
         className={cn(commandItemVariants(), className)}
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
