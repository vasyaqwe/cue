import { useEventListener } from "@/interactions/use-event-listener"
import { useEditorStore } from "@/ui/components/editor/store"
import type { Range } from "@tiptap/core"
import { Command } from "cmdk"
import { createContext, forwardRef, useEffect } from "react"
import type { ComponentPropsWithoutRef } from "react"
import { P, match } from "ts-pattern"
import type tunnel from "tunnel-rat"

export const EditorCommandTunnelContext = createContext(
   {} as ReturnType<typeof tunnel>,
)

export function EditorCommandOut({
   query,
   range,
}: {
   query: string
   range: Range
}) {
   useEffect(() => {
      useEditorStore.setState({ query })
   }, [query])

   useEffect(() => {
      useEditorStore.setState({ range })
   }, [range])

   useEventListener("keydown", (e) =>
      match(e.key).with("ArrowUp", "ArrowDown", "Enter", () => {
         e.preventDefault()
         match(document.querySelector("#slash-command")).with(
            P.not(null),
            (ref) =>
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
      <EditorCommandTunnelContext.Consumer>
         {(tunnelInstance) => <tunnelInstance.Out />}
      </EditorCommandTunnelContext.Consumer>
   )
}

export const EditorCommand = forwardRef<
   HTMLDivElement,
   ComponentPropsWithoutRef<typeof Command>
>(({ children, ...props }, ref) => {
   const query = useEditorStore().query

   return (
      <EditorCommandTunnelContext.Consumer>
         {(tunnelInstance) => (
            <tunnelInstance.In>
               <Command
                  ref={ref}
                  onKeyDown={(e) => {
                     e.stopPropagation()
                  }}
                  id="slash-command"
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
            </tunnelInstance.In>
         )}
      </EditorCommandTunnelContext.Consumer>
   )
})

export const EditorCommandList = Command.List
