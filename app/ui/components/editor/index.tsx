import { cn } from "@/ui/utils"
import { EditorProvider, useEditor } from "@tiptap/react"
import type { EditorProviderProps } from "@tiptap/react"
import { forwardRef, useRef } from "react"
import type { ReactNode } from "react"
import tunnel from "tunnel-rat"
import { EditorCommandTunnelContext } from "./editor-command"

export type EditorProps = {
   children: ReactNode
   className?: string
}

type EditorRootProps = {
   children: ReactNode
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
   children?: ReactNode
   className?: string
   content?: string
   placeholder: string
}

export const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
   (
      { className, children, content, placeholder, editorProps, ...props },
      ref,
   ) => {
      const editor = useEditor({
         extensions: props.extensions,
      })

      const classAttr =
         editorProps?.attributes && "class" in editorProps.attributes
            ? editorProps?.attributes.class
            : ""

      return (
         <div
            ref={ref}
            className={cn("", className)}
         >
            {editor === null ? (
               <>
                  {content === "<p></p>" ? (
                     <p
                        className={cn(
                           "prose mt-2 min-h-9 max-w-full break-all text-foreground/40 prose-p:my-2 prose-h2:mt-0 prose-h1:mb-3 prose-h2:mb-3 prose-ol:pl-4 prose-ul:pl-4 prose-h1:text-2xl prose-h2:text-xl prose-headings:text-foreground focus:outline-none",
                           classAttr,
                        )}
                     >
                        {placeholder}
                     </p>
                  ) : (
                     <div
                        className={cn(
                           "prose mt-2 min-h-9 max-w-full break-all prose-p:my-2 prose-h2:mt-0 prose-h1:mb-3 prose-h2:mb-3 prose-ol:pl-4 prose-ul:pl-4 prose-h1:text-2xl prose-h2:text-xl prose-headings:text-foreground focus:outline-none",
                           classAttr,
                        )}
                        dangerouslySetInnerHTML={{
                           __html: content ?? "",
                        }}
                     />
                  )}
               </>
            ) : (
               <EditorProvider
                  {...props}
                  editorProps={{
                     ...editorProps,
                     attributes: {
                        class: cn(
                           "prose mt-2 min-h-9 max-w-full break-all prose-p:my-2 prose-h2:mt-0 prose-h1:mb-3 prose-h2:mb-3 prose-ol:pl-4 prose-ul:pl-4 prose-h1:text-2xl prose-h2:text-xl prose-headings:text-foreground focus:outline-none",
                           classAttr,
                        ),
                     },
                  }}
                  content={content}
               >
                  {children}
               </EditorProvider>
            )}
         </div>
      )
   },
)
