import { SlashCommandPopover } from "@/ui/components/editor/command/command-popover"
import { commandItems } from "@/ui/components/editor/command/items"
import type { Range } from "@tiptap/core"
import type { Editor } from "@tiptap/core"
import { Extension } from "@tiptap/core"
import { ReactRenderer } from "@tiptap/react"
import suggesionExtension, { type SuggestionOptions } from "@tiptap/suggestion"

export const renderCommandItems = () => {
   let component: ReactRenderer | null = null
   return {
      onStart: (props: {
         editor: Editor
         clientRect: DOMRect
         range: Range
         query: string
      }) => {
         component = new ReactRenderer(SlashCommandPopover, {
            props,
            editor: props.editor,
         })

         const { selection } = props.editor.state
         const parentNode = selection.$from.node(selection.$from.depth)
         const blockType = parentNode.type.name

         if (blockType === "codeBlock") return false
      },
      onUpdate: (props: {
         clientRect: never
         range: Range
         query: string
      }) => {
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
         suggesionExtension({
            editor: this.editor,
            ...this.options.suggestion,
         }),
      ]
   },
})

export const slashCommand = slashCommandExtension.configure({
   suggestion: {
      items: () => commandItems,
      render: renderCommandItems,
   },
})
