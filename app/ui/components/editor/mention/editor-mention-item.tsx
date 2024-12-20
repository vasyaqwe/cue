import {
   CommandEmpty,
   CommandItem,
   commandItemVariants,
} from "@/ui/components/command"
import { cn } from "@/ui/utils"
import type { Editor, Range } from "@tiptap/core"
import { useCurrentEditor } from "@tiptap/react"
import * as React from "react"

type Props = {
   onSelect: ({
      editor,
      range,
   }: {
      editor: Editor
      range: Range
   }) => void
}

export const EditorMentionItem = React.forwardRef<
   HTMLDivElement,
   Props & React.ComponentPropsWithoutRef<typeof CommandItem>
>(({ children, className, ...props }, ref) => {
   const { editor } = useCurrentEditor()

   if (!editor) return null

   return (
      <CommandItem
         ref={ref}
         className={cn(
            commandItemVariants(),
            "rounded-xl max-md:h-11 max-md:text-base",
            className,
         )}
         {...props}
      >
         {children}
      </CommandItem>
   )
})

export function EditorMentionEmpty({
   className,
   ...props
}: React.ComponentProps<typeof CommandEmpty>) {
   return (
      <CommandEmpty
         className={cn("py-6 text-center text-foreground/75", className)}
         {...props}
      />
   )
}
