import { useInsertComment } from "@/comment/hooks/use-insert-comment"
import { Button } from "@/ui/components/button"
import { cardVariants } from "@/ui/components/card"
import { Icons } from "@/ui/components/icons"
import { Kbd } from "@/ui/components/kbd"
import { Tooltip } from "@/ui/components/tooltip"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { useParams } from "@tanstack/react-router"
import { type ComponentProps, useState } from "react"

export function CreateComment({
   onMutate,
   className,
   ...props
}: ComponentProps<"form"> & { onMutate?: () => void }) {
   const [content, setContent] = useState("")
   const { organizationId, user } = useAuth()
   const { issueId } = useParams({ strict: false })
   if (!issueId) throw new Error("Must have issueId param")

   const { insertComment } = useInsertComment({ onMutate })

   const isEmpty = content.trim() === ""

   return (
      <form
         className={cn(
            cardVariants(),
            "border-border/45 pt-0 transition-colors has-focus:border-border",
            className,
         )}
         onSubmit={(e) => {
            e.preventDefault()
            insertComment.mutate({
               content,
               authorId: user.id,
               issueId,
               organizationId,
            })

            setContent("")
         }}
         {...props}
      >
         <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border-transparent pt-2 pb-5 text-[0.96rem] text-base outline-none placeholder:text-muted-foreground/70"
            placeholder="Leave a comment.."
         />
         <div className="mt-1 flex items-center gap-2">
            <Tooltip
               content={
                  <span className="flex items-center gap-2">
                     Attach files
                     <span className="inline-flex items-center gap-1">
                        <Kbd>Ctrl</Kbd>
                        <Kbd className="px-0.5 py-0">
                           <Icons.shift className="h-5 w-[18px]" />
                        </Kbd>
                        <Kbd>F</Kbd>
                     </span>
                  </span>
               }
            >
               <Button
                  type="button"
                  aria-label="Attach files"
                  size="icon"
                  variant={"ghost"}
               >
                  <Icons.paperClip className="size-5 opacity-80" />
               </Button>
            </Tooltip>
            <Tooltip
               content={
                  <span className="flex items-center gap-2">
                     Submit
                     <span className="inline-flex items-center gap-1">
                        <Kbd>Ctrl</Kbd> <Kbd>Enter</Kbd>
                     </span>
                  </span>
               }
            >
               <Button
                  disabled={isEmpty}
                  aria-label="Submit comment"
                  size="icon"
                  className="ml-auto"
               >
                  <Icons.arrowUp className="size-5" />
               </Button>
            </Tooltip>
         </div>
      </form>
   )
}
