import { suggestionItems } from "@/ui/components/editor/extensions/slash-command"
import { Popover, PopoverContent } from "@/ui/components/popover"
import { cn } from "@/ui/utils"
import { Extension } from "@tiptap/core"
import type { Editor, Range } from "@tiptap/core"
import TiptapLink from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { ReactRenderer } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion"
import { type RefObject, useState } from "react"
import type { ReactNode } from "react"
import { match } from "ts-pattern"
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

const SlashCommandPopover = ({
   clientRect,
   query,
   range,
}: {
   clientRect: () => DOMRect
   query: string
   range: Range
}) => {
   const [open, setOpen] = useState(true)
   const position = clientRect()

   return (
      <Popover
         open={open}
         onOpenChange={setOpen}
         drawerOnMobile={false}
      >
         <PopoverContent
            drawerOnMobile={false}
            title="Command"
            container={document.body}
            side="bottom"
            align="start"
            className="mt-2 min-w-56"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            style={{
               position: "absolute",
               left: position.left,
               top: position.bottom,
            }}
         >
            <EditorCommandOut
               query={query}
               range={range}
            />
         </PopoverContent>
      </Popover>
   )
}

const renderItems = (_elementRef?: RefObject<Element> | null) => {
   let component: ReactRenderer | null = null
   return {
      onStart: (props: {
         editor: Editor
         clientRect: DOMRect
         items: SuggestionItem[]
         command: never
         range: Range
         query: string
      }) => {
         component = new ReactRenderer(SlashCommandPopover, {
            props: {
               clientRect: props.clientRect,
               query: props.query,
               range: props.range,
            },
            editor: props.editor,
         })

         const { selection } = props.editor.state
         const parentNode = selection.$from.node(selection.$from.depth)
         const blockType = parentNode.type.name
         if (blockType === "codeBlock") {
            return false
         }
      },
      onUpdate: (props: {
         editor: Editor
         clientRect: never
         items: SuggestionItem[]
         command: never
         range: Range
         query: string
      }) => {
         component?.updateProps({
            editor: props.editor,
            clientRect: props.clientRect,
            query: props.query,
            range: props.range,
         })
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

type SuggestionItem = {
   title: string
   icon: ReactNode
   searchTerms?: string[]
   command?: (props: { editor: Editor; range: Range }) => void
}

const handleCommandNavigation = (event: KeyboardEvent) =>
   match(event.key)
      .with("ArrowUp", "ArrowDown", "Enter", () => {
         const slashCommand = document.querySelector("#slash-command")
         return !!slashCommand
      })
      .otherwise(() => false)

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

export {
   starterKit,
   placeholder,
   slashCommand,
   link,
   renderItems,
   type SuggestionItem,
   handleCommandNavigation,
}
