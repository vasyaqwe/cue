import type { IssueStatus } from "@/issue/schema"
import {
   mentionLabelIssueClassName,
   mentionLabelPersonClassName,
} from "@/ui/components/editor/mention/constants"
import { MentionLabel } from "@/ui/components/editor/mention/mention-label"
import MentionPopover from "@/ui/components/editor/mention/mention-popover"
import { cn } from "@/ui/utils"
import mentionExtension from "@tiptap/extension-mention"
import { ReactRenderer, mergeAttributes } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import type { SuggestionProps } from "@tiptap/suggestion"

export const renderMentionItems = () => {
   let component: ReactRenderer | null = null
   return {
      onStart: (props: SuggestionProps) => {
         component = new ReactRenderer(MentionPopover, {
            props: props,
            editor: props.editor,
         })

         const { selection } = props.editor.state
         const parentNode = selection.$from.node(selection.$from.depth)
         const blockType = parentNode.type.name

         if (blockType === "codeBlock") return false
      },
      onUpdate: (props: SuggestionProps) => {
         component?.updateProps(props)
      },
      onKeyDown: (props: { event: KeyboardEvent }) => {
         // @ts-expect-error
         return component?.ref?.onKeyDown(props)
      },
      onExit: () => {
         component?.destroy()
      },
   }
}

const baseMention = mentionExtension.extend({
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
         issueId: {
            default: null,
         },
         status: {
            default: null,
         },
      }
   },
   renderHTML({ HTMLAttributes, node }) {
      return [
         "span",
         mergeAttributes(HTMLAttributes, {
            class: node.attrs.issueId
               ? cn(mentionLabelIssueClassName, "text-transparent")
               : mentionLabelPersonClassName,
         }),
         node.attrs.issueId ? `@ ${node.attrs.label}` : `@${node.attrs.label}`,
      ]
   },
})

export const mention = baseMention.configure({
   suggestion: {
      render: renderMentionItems,
      command: ({ editor, range, props: _props }) => {
         const { label, issueId, userId, status } = _props as unknown as {
            label: string
            userId?: string | undefined
            issueId?: string | undefined
            status?: IssueStatus | undefined
         }
         editor
            .chain()
            .focus()
            .insertContentAt(range, [
               {
                  type: "mention",
                  attrs: {
                     label,
                     userId,
                     issueId,
                     status,
                  },
               },
            ])
            .run()
      },
   },
})
