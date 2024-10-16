import { EditorCommandTunnelContext } from "@/ui/components/editor/command/editor-command"
import { useMentionContext } from "@/ui/components/editor/mention/context"
import { getMentionsFromDoc } from "@/ui/components/editor/mention/utils"
import { useEditorStore } from "@/ui/components/editor/store"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { EditorProvider, useEditor } from "@tiptap/react"
import type { EditorProviderProps } from "@tiptap/react"
import { forwardRef, useRef } from "react"
import type { ReactNode } from "react"
import { match } from "ts-pattern"
import tunnel from "tunnel-rat"

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
   placeholder?: string
}

export const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
   (
      {
         className,
         children,
         content,
         onUpdate,
         placeholder = "",
         editorProps,
         ...props
      },
      ref,
   ) => {
      const { user } = useAuth()
      const editor = useEditor({
         content,
         ...props,
      })

      const classAttr =
         editorProps?.attributes && "class" in editorProps.attributes
            ? editorProps?.attributes.class
            : ""

      const context = useMentionContext()
      const mentionedUserIds = useEditorStore().getMentionedUserIds(context)
      const addMentionedUser = useEditorStore().addMentionedUser
      const removeMentionedUser = useEditorStore().removeMentionedUser

      return (
         <div
            ref={ref}
            className={cn("", className)}
         >
            {editor === null ? (
               <>
                  {content === "<p></p>" || content === "" ? (
                     <p
                        className={cn(
                           "prose mt-2 min-h-9 max-w-full break-words text-base text-foreground/40 prose-img:m-0 prose-p:my-2 prose-h2:mt-0 prose-h1:mb-3 prose-h2:mb-3 prose-ol:pl-4 prose-ul:pl-4 prose-h1:text-2xl prose-h2:text-xl prose-headings:text-foreground prose-p:text-base focus:outline-none",
                           classAttr,
                        )}
                     >
                        {placeholder}
                     </p>
                  ) : (
                     <div
                        className={cn(
                           "prose mt-2 min-h-9 max-w-full break-words text-base prose-img:m-0 prose-p:my-2 prose-h2:mt-0 prose-h1:mb-3 prose-h2:mb-3 prose-ol:pl-4 prose-ul:pl-4 prose-h1:text-2xl prose-h2:text-xl prose-headings:text-foreground prose-p:text-base focus:outline-none",
                           classAttr,
                        )}
                        dangerouslySetInnerHTML={{
                           __html:
                              content?.replaceAll(
                                 "<p></p>",
                                 "<p><br class='ProseMirror-trailingBreak'></p>",
                              ) ?? "",
                        }}
                     />
                  )}
               </>
            ) : (
               <EditorProvider
                  {...props}
                  onUpdate={({ editor, transaction }) => {
                     const mentionsBefore = getMentionsFromDoc(
                        transaction.before,
                     )
                     const mentionsAfter = getMentionsFromDoc(transaction.doc)

                     const removedMentions = mentionsBefore
                        .filter(
                           (mention) =>
                              !mentionsAfter.some(
                                 (m) => m.userId === mention.userId,
                              ),
                        )
                        .map((mention) => mention.userId)
                        .filter(Boolean)

                     const addedMentions = mentionsAfter
                        .filter(
                           (mention) =>
                              !mentionsBefore.some(
                                 (m) => m.userId === mention.userId,
                              ) && mention.userId !== user.id,
                        )
                        .map((mention) => mention.userId)
                        .filter(Boolean)

                     for (const userId of removedMentions) {
                        removeMentionedUser(context, userId)
                     }

                     for (const userId of addedMentions) {
                        if (!mentionedUserIds?.includes(userId)) {
                           addMentionedUser(context, userId)
                        }
                     }

                     onUpdate?.({ editor, transaction })
                  }}
                  editorProps={{
                     ...editorProps,

                     handleDOMEvents: {
                        ...editorProps?.handleDOMEvents,
                        keydown: (_view, event) =>
                           match(event.key)
                              .with("ArrowUp", "ArrowDown", "Enter", () => {
                                 const slashCommand =
                                    document.querySelector("#slash-command")
                                 return !!slashCommand
                              })
                              .otherwise(() => false),
                     },
                     attributes: {
                        ...editorProps?.attributes,
                        class: cn(
                           "prose mt-2 min-h-9 max-w-full break-words prose-img:m-0 prose-p:my-2 prose-h2:mt-0 prose-h1:mb-3 prose-h2:mb-3 prose-ol:pl-4 prose-ul:pl-4 prose-h1:text-2xl prose-h2:text-xl prose-headings:text-foreground prose-p:text-base focus:outline-none",
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
