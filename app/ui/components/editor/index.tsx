import { EditorCommandTunnelContext } from "@/ui/components/editor/command/editor-command"
import { useMentionContext } from "@/ui/components/editor/mention/context"
import { getMentionsFromDoc } from "@/ui/components/editor/mention/utils"
import { useEditorStore } from "@/ui/components/editor/store"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { EditorProvider, useEditor } from "@tiptap/react"
import type { EditorProviderProps } from "@tiptap/react"
import * as React from "react"
import { match } from "ts-pattern"
import tunnel from "tunnel-rat"

export type EditorProps = {
   children: React.ReactNode
   className?: string
}

type EditorRootProps = {
   children: React.ReactNode
}

export function EditorRoot({ children }: EditorRootProps) {
   const tunnelInstance = React.useRef(tunnel()).current

   return (
      <EditorCommandTunnelContext.Provider value={tunnelInstance}>
         {children}
      </EditorCommandTunnelContext.Provider>
   )
}

export type EditorContentProps = Omit<EditorProviderProps, "content"> & {
   children?: React.ReactNode
   className?: string
   content?: string
   placeholder?: string
}

export const EditorContent = React.forwardRef<
   HTMLDivElement,
   EditorContentProps
>(
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

      const baseClassName = cn(
         "prose mt-2 min-h-9 max-w-full break-words prose-img:m-0 prose-p:my-3.5 prose-h2:mt-0 prose-h1:mb-3 prose-h2:mb-3",
         "prose-code:after:hidden prose-code:before:hidden prose-ol:pl-4 prose-ul:pl-4 prose-h3:font-bold prose-code:text-sm prose-h1:text-2xl",
         "prose-h2:text-xl prose-h3:text-[1.1rem] prose-headings:text-foreground prose-p:text-base prose-p:text-foreground focus:outline-hidden",
      )

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
                           baseClassName,
                           "text-base text-foreground/40",
                           classAttr,
                        )}
                     >
                        {placeholder}
                     </p>
                  ) : (
                     <div
                        className={cn(baseClassName, classAttr)}
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
                        class: cn(baseClassName, classAttr),
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
