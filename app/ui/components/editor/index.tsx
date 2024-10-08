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
   ({ className, children, content, editorProps, ...props }, ref) => {
      return (
         <div
            ref={ref}
            className={cn("min-h-8", className)}
         >
            <EditorProvider
               {...props}
               editorProps={{
                  attributes: {
                     class: cn(
                        "prose max-w-full prose-p:my-2 prose-h2:mt-0 prose-h1:mb-3 prose-h2:mb-3 prose-h1:text-2xl prose-h2:text-xl focus:outline-none",
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
      )
   },
)
