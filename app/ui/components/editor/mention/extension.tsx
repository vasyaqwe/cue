import MentionPopover from "@/ui/components/editor/mention/mention-popover"
import { ReactRenderer } from "@tiptap/react"
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
