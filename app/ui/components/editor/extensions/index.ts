import {
   renderItems,
   suggestionItems,
} from "@/ui/components/editor/extensions/slash-command"
import { cn } from "@/ui/utils"
import { Extension } from "@tiptap/core"
import TiptapLink from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion"

const slashCommandExtension = Extension.create({
   name: "slash-command",
   addOptions() {
      return {
         suggestion: {
            char: "/",
            command: ({ editor, range, props }) => {
               props.command({ editor, range })
            },
         } as SuggestionOptions,
      }
   },
   addProseMirrorPlugins() {
      return [
         Suggestion({
            editor: this.editor,
            ...this.options.suggestion,
         }),
      ]
   },
})

const slashCommand = slashCommandExtension.configure({
   suggestion: {
      items: () => suggestionItems,
      render: renderItems,
   },
})

const placeholder = (placeholder: string) =>
   Placeholder.configure({
      placeholder: () => placeholder,
      includeChildren: true,
   })

const link = TiptapLink.configure({
   HTMLAttributes: {
      class: cn(
         "cursor-pointer text-muted-foreground underline underline-offset-[3px] transition-colors hover:text-primary",
      ),
   },
})

const starterKit = StarterKit.configure({
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

export { starterKit, placeholder, slashCommand, link }
