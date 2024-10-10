import {
   commandItems,
   renderCommandItems,
} from "@/ui/components/editor/command/extension"
import { mentionLabelClassName } from "@/ui/components/editor/mention/constants"
import { renderMentionItems } from "@/ui/components/editor/mention/extension"
import { MentionLabel } from "@/ui/components/editor/mention/mention-label"
import { cn } from "@/ui/utils"
import { Extension, mergeAttributes } from "@tiptap/core"
import TiptapLink from "@tiptap/extension-link"
import Mention from "@tiptap/extension-mention"
import Placeholder from "@tiptap/extension-placeholder"
import { ReactNodeViewRenderer } from "@tiptap/react"
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
      items: () => commandItems,
      render: renderCommandItems,
   },
})

const baseMention = Mention.extend({
   addNodeView() {
      return ReactNodeViewRenderer(MentionLabel)
   },
   parseHTML() {
      return [
         {
            tag: "span",
         },
      ]
   },
   addAttributes() {
      return {
         ...this.parent?.(),
         userId: {
            default: null,
         },
      }
   },
   renderHTML({ HTMLAttributes, node }) {
      return [
         "span",
         mergeAttributes(HTMLAttributes, {
            class: mentionLabelClassName,
         }),
         `@${node.attrs.label}`,
      ]
   },
})

const mention = baseMention.configure({
   suggestion: {
      render: renderMentionItems,
      command: ({ editor, range, props: _props }) => {
         const props = _props as unknown as {
            label: string
            userId: string
         }
         editor
            .chain()
            .focus()
            .insertContentAt(range, [
               {
                  type: "mention",
                  attrs: {
                     label: props.label,
                     userId: props.userId,
                  },
               },
            ])
            .run()
      },
   },
})

const placeholder = (placeholder: string) =>
   Placeholder.configure({
      placeholder: () => placeholder,
      includeChildren: true,
   })

const link = TiptapLink.configure({
   HTMLAttributes: {
      class: cn("cursor-pointer underline"),
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

export { starterKit, placeholder, slashCommand, mention, link }
