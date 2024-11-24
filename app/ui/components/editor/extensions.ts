import { cn } from "@/ui/utils"
import placeholderExtension from "@tiptap/extension-placeholder"
import starterKitExtension from "@tiptap/starter-kit"

const placeholder = (placeholder: string) =>
   placeholderExtension.configure({
      placeholder: () => placeholder,
      includeChildren: true,
   })

const starterKit = starterKitExtension.configure({
   bulletList: {
      HTMLAttributes: {
         class: cn("list-outside list-disc leading-3"),
      },
   },
   orderedList: {
      HTMLAttributes: {
         class: cn("list-outside list-decimal leading-3"),
      },
   },
   listItem: {
      HTMLAttributes: {
         class: cn("leading-normal"),
      },
   },
   code: {
      HTMLAttributes: {
         class: cn(
            "rounded-md border border-border bg-elevated px-1.5 py-1 font-medium font-mono",
         ),
         spellcheck: "false",
      },
   },
   gapcursor: false,
})

export { starterKit, placeholder }
