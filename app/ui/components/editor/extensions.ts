import { cn } from "@/ui/utils"
import linkExtension from "@tiptap/extension-link"
import placeholderExtension from "@tiptap/extension-placeholder"
import starterKitExtension from "@tiptap/starter-kit"

const placeholder = (placeholder: string) =>
   placeholderExtension.configure({
      placeholder: () => placeholder,
      includeChildren: true,
   })

const link = linkExtension.configure({
   HTMLAttributes: {
      class: cn("cursor-pointer underline"),
   },
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
   gapcursor: false,
})

export { starterKit, placeholder, link }
