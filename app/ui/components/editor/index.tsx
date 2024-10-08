import { cn } from "@/ui/utils"
import { EditorProvider } from "@tiptap/react"
import type { EditorProviderProps, JSONContent } from "@tiptap/react"
import { forwardRef, useRef } from "react"
import type { ReactNode } from "react"
import tunnel from "tunnel-rat"
import { EditorCommandTunnelContext } from "./editor-command"

export type EditorProps = {
   readonly children: ReactNode
   readonly className?: string
}

type EditorRootProps = {
   readonly children: ReactNode
}

export function EditorRoot({ children }: EditorRootProps) {
   const tunnelInstance = useRef(tunnel()).current

   return (
      <EditorCommandTunnelContext.Provider value={tunnelInstance}>
         {children}
      </EditorCommandTunnelContext.Provider>
   )
}

export type EditorContentProps = Omit<EditorProviderProps, "content"> & {
   readonly children?: ReactNode
   readonly className?: string
   readonly content?: JSONContent
}

export const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
   ({ className, children, content, editorProps, ...props }, ref) => (
      <div
         ref={ref}
         className={cn("rounded-xl border p-4", className)}
      >
         <EditorProvider
            {...props}
            editorProps={{
               attributes: {
                  class: cn(
                     "prose prose-lg dark:prose-invert max-w-full font-default prose-headings:font-title focus:outline-none",
                     editorProps?.attributes &&
                        "class" in editorProps.attributes
                        ? editorProps?.attributes.class
                        : "",
                  ),
               },
               ...editorProps,
            }}
            content={content}
         >
            {children}
         </EditorProvider>
      </div>
   ),
)
