import { useEventListener } from "@/interactions/use-event-listener"
import {
   Command,
   CommandLabel,
   CommandSeparator,
} from "@/ui/components/command"
import { useEditorStore } from "@/ui/components/editor/store"
import * as React from "react"
import { P, match } from "ts-pattern"

export const EditorMention = React.forwardRef<
   HTMLDivElement,
   React.ComponentPropsWithoutRef<typeof Command> & { query: string }
>(({ children, query, ...props }, ref) => {
   useEventListener("keydown", (e) =>
      match(e.key).with("ArrowUp", "ArrowDown", "Enter", () => {
         e.preventDefault()
         match(document.querySelector("#mention")).with(P.not(null), (ref) =>
            ref.dispatchEvent(
               new KeyboardEvent("keydown", {
                  key: e.key,
                  cancelable: true,
                  bubbles: true,
               }),
            ),
         )
      }),
   )

   return (
      <Command
         ref={ref}
         onKeyDown={(e) => {
            e.stopPropagation()
         }}
         id="mention"
         {...props}
      >
         <Command.Input
            value={query}
            onValueChange={() => useEditorStore.setState({ query })}
            style={{ display: "none" }}
            autoFocus={false}
         />
         {children}
      </Command>
   )
})

export const EditorMentionList = Command.List
export const EditorMentionGroup = Command.Group
export const EditorMentionLabel = CommandLabel
export const EditorMentionSeparator = CommandSeparator
