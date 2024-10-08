import { useEventListener } from "@/interactions/use-event-listener"
import { useEditorStore } from "@/ui/components/editor/store"
import { cn } from "@/ui/utils"
import type { Range } from "@tiptap/core"
import { Command } from "cmdk"
import { createContext, forwardRef, useEffect } from "react"
import type { ComponentPropsWithoutRef, FC } from "react"
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

   useEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
         e.preventDefault()
         const commandRef = document.querySelector("#slash-command")
         if (!commandRef) return

         commandRef.dispatchEvent(
            new KeyboardEvent("keydown", {
               key: e.key,
               cancelable: true,
               bubbles: true,
            }),
         )
      }
   })

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
                     "z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all",
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
