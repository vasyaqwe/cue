import { useEventListener } from "@/interactions/use-event-listener"
import { useEditorStore } from "@/ui/components/editor/store"
import { cn } from "@/ui/utils"
import type { Range } from "@tiptap/core"
import { Command } from "cmdk"
import { createContext, forwardRef, useEffect } from "react"
import type { ComponentPropsWithoutRef, FC } from "react"
import { P, match } from "ts-pattern"
import type tunnel from "tunnel-rat"

export const EditorCommandTunnelContext = createContext(
   {} as ReturnType<typeof tunnel>,
)

type EditorCommandOutProps = {
   readonly query: string
   readonly range: Range
}

export const EditorCommandOut: FC<EditorCommandOutProps> = ({
   query,
   range,
}) => {
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
>(({ children, className, ...props }, ref) => {
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
                  className={cn(
                     "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg outline-none",
                     className,
                  )}
                  {...props}
               >
                  <Command.Input
                     value={query}
                     onValueChange={() => useEditorStore.setState({ query })}
                     style={{ display: "none" }}
                  />
                  {children}
               </Command>
            </tunnelInstance.In>
         )}
      </EditorCommandTunnelContext.Consumer>
   )
})

export const EditorCommandList = Command.List
