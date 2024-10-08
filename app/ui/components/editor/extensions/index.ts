import { suggestionItems } from "@/ui/components/editor/extensions/slash-command"
import { cn } from "@/ui/utils"
import { Extension } from "@tiptap/core"
import type { Editor, Range } from "@tiptap/core"
import TiptapLink from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { ReactRenderer } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion"
import type { RefObject } from "react"
import type { ReactNode } from "react"
import tippy, {
   type GetReferenceClientRect,
   type Instance,
   type Props,
} from "tippy.js"
import { EditorCommandOut } from "../editor-command"

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

const renderItems = (elementRef?: RefObject<Element> | null) => {
   let component: ReactRenderer | null = null
   let popup: Instance<Props>[] | null = null

   return {
      onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
         component = new ReactRenderer(EditorCommandOut, {
            props,
            editor: props.editor,
         })

         const { selection } = props.editor.state

         const parentNode = selection.$from.node(selection.$from.depth)
         const blockType = parentNode.type.name

         if (blockType === "codeBlock") {
            return false
         }

         // @ts-ignore
         popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => (elementRef ? elementRef.current : document.body),
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
         })
      },
      onUpdate: (props: {
         editor: Editor
         clientRect: GetReferenceClientRect
      }) => {
         component?.updateProps(props)

         popup?.[0]?.setProps({
            getReferenceClientRect: props.clientRect,
         })
      },

      onKeyDown: (props: { event: KeyboardEvent }) => {
         if (props.event.key === "Escape") {
            popup?.[0]?.hide()

            return true
         }

         // @ts-ignore
         return component?.ref?.onKeyDown(props)
      },
      onExit: () => {
         popup?.[0]?.destroy()
         component?.destroy()
      },
   }
}

type SuggestionItem = {
   title: string
   icon: ReactNode
   searchTerms?: string[]
   command?: (props: { editor: Editor; range: Range }) => void
}

const handleCommandNavigation = (event: KeyboardEvent) => {
   if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
      const slashCommand = document.querySelector("#slash-command")
      if (slashCommand) {
         return true
      }
   }
}

const slashCommand = slashCommandExtension.configure({
   suggestion: {
      items: () => suggestionItems,
      render: renderItems,
   },
})

const placeholder = Placeholder.configure({
   placeholder: ({ node }) => {
      if (node.type.name === "heading") {
         return `Heading ${node.attrs.level}`
      }
      return "Press '/' for commands"
   },
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
         class: cn("-mt-2 list-outside list-disc leading-3"),
      },
   },
   orderedList: {
      HTMLAttributes: {
         class: cn("-mt-2 list-outside list-decimal leading-3"),
      },
   },
   listItem: {
      HTMLAttributes: {
         class: cn("-mb-2 leading-normal"),
      },
   },
   blockquote: {
      HTMLAttributes: {
         class: cn("border-primary border-l-4"),
      },
   },
   codeBlock: {
      HTMLAttributes: {
         class: cn(
            "rounded-md border bg-muted p-5 font-medium font-mono text-muted-foreground",
         ),
      },
   },
   code: {
      HTMLAttributes: {
         class: cn("rounded-md bg-muted px-1.5 py-1 font-medium font-mono"),
         spellcheck: "false",
      },
   },
   horizontalRule: false,
   dropcursor: {
      color: "#DBEAFE",
      width: 4,
   },
   gapcursor: false,
})

export {
   starterKit,
   placeholder,
   slashCommand,
   link,
   renderItems,
   type SuggestionItem,
   handleCommandNavigation,
}
