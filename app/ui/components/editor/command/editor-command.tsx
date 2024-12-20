import { useEventListener } from "@/interactions/use-event-listener"
import { Command } from "@/ui/components/command"
import { useEditorStore } from "@/ui/components/editor/store"
import type { Range } from "@tiptap/core"
import * as React from "react"
import { P, match } from "ts-pattern"
import type tunnel from "tunnel-rat"

export const EditorCommandTunnelContext = React.createContext(
   {} as ReturnType<typeof tunnel>,
)

export function EditorCommandOut({
   query,
   range,
}: {
   query: string
   range: Range
}) {
   React.useEffect(() => {
      useEditorStore.setState({ query })
   }, [query])

   React.useEffect(() => {
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

export const EditorCommand = React.forwardRef<
   HTMLDivElement,
   React.ComponentPropsWithoutRef<typeof Command>
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
