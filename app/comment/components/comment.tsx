import type * as commentFns from "@/comment/functions"
import { useDeleteComment } from "@/comment/hooks/use-delete-comment"
import { useUpdateComment } from "@/comment/hooks/use-update-comment"
import { Button } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { Tooltip } from "@/ui/components/tooltip"
import { TransitionHeight } from "@/ui/components/transition-height"
import { UserAvatar } from "@/ui/components/user-avatar"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { formatDateRelative } from "@/utils/format"
import { useLocation, useParams } from "@tanstack/react-router"
import type { Timeout } from "node_modules/@tanstack/react-router/dist/esm/utils"
import { useEffect, useState } from "react"
import { P, match } from "ts-pattern"

export function Comment({
   comment,
}: { comment: Awaited<ReturnType<typeof commentFns.list>>[number] }) {
   const { issueId } = useParams({ strict: false })
   if (!issueId) throw new Error("Comment must be used in an $issueId route")

   const { user, organizationId } = useAuth()
   const { hash } = useLocation()
   const { deleteComment } = useDeleteComment()
   const { updateComment } = useUpdateComment()
   const resolvedBy = comment.resolvedBy

   const [isExpanded, setIsExpanded] = useState(!resolvedBy)
   const [isHighlighted, setIsHighlighted] = useState(false)

   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   useEffect(() => {
      let timeout: Timeout | null = null
      match(hash).with(comment.id, () => {
         setIsHighlighted(true)

         timeout = setTimeout(() => {
            setIsHighlighted(false)
         }, 3000)

         match(document.getElementById(hash)).with(
            P.not(P.nullish),
            (element) => element.scrollIntoView({ behavior: "smooth" }),
         )
      })

      return () => {
         if (timeout) clearTimeout(timeout)
      }
   }, [])

   useEffect(() => {
      match(resolvedBy)
         .with(null, () => setIsExpanded(true))
         .otherwise(() => setIsExpanded(false))
   }, [resolvedBy])

   const delayedResolvedBy = useDelayedValue(resolvedBy, 500)

   return (
      <div
         id={comment.id}
         className={cn(
            "px-4 py-2 transition-colors 2xl:rounded-lg",
            isHighlighted
               ? "bg-highlight/80 duration-300"
               : "bg-transparent duration-1000",
         )}
      >
         <TransitionHeight
            className="mt-2"
            data-expanded={isExpanded}
         >
            <div className="group relative flex gap-3">
               <UserAvatar user={comment.author} />
               <div className={cn("flex-1")}>
                  <div className="-mt-[4px] flex max-h-[22px] items-center justify-between">
                     <p className="line-clamp-1">
                        <strong className="mr-1 font-semibold">
                           {comment.author.name}
                        </strong>
                        <small className="text-foreground/60 text-sm">
                           {formatDateRelative(comment.createdAt, "narrow")}
                        </small>
                     </p>
                     <div className="max-md:-top-0.5 relative top-px right-px flex items-center rounded-full p-0.5 transition-opacity md:pointer-events-none md:group-hover:pointer-events-auto md:absolute md:group-hover:opacity-100 md:opacity-0 md:shadow-button">
                        {resolvedBy ? (
                           <Tooltip content="Reopen comment">
                              <Button
                                 onClick={() => {
                                    updateComment.mutate({
                                       id: comment.id,
                                       organizationId,
                                       resolvedById: null,
                                       issueId,
                                    })
                                 }}
                                 aria-label="Reopen comment"
                                 variant={"ghost"}
                                 size={"icon-sm"}
                              >
                                 <Icons.reload className="size-[18px]" />
                              </Button>
                           </Tooltip>
                        ) : (
                           <Tooltip content="Resolve comment">
                              <Button
                                 onClick={() => {
                                    updateComment.mutate({
                                       id: comment.id,
                                       organizationId,
                                       resolvedById: user.id,
                                       issueId,
                                    })
                                 }}
                                 aria-label="Resolve comment"
                                 variant={"ghost"}
                                 size={"icon-sm"}
                              >
                                 <Icons.doubleCheck className="size-[18px]" />
                              </Button>
                           </Tooltip>
                        )}
                        {user.id === comment.author.id && (
                           <Tooltip content="Delete comment">
                              <Button
                                 onClick={() =>
                                    deleteComment.mutate({
                                       commentId: comment.id,
                                    })
                                 }
                                 aria-label="Delete comment"
                                 variant={"ghost"}
                                 size={"icon-sm"}
                              >
                                 <Icons.trash className="size-[18px]" />
                              </Button>
                           </Tooltip>
                        )}
                     </div>
                  </div>
                  <p className="mt-0.5">{comment.content}</p>
               </div>
            </div>
         </TransitionHeight>
         <TransitionHeight
            className="group"
            data-expanded={!!resolvedBy}
         >
            <div className="relative flex items-center gap-[12px] pt-3">
               <span
                  className={
                     "ml-[3px] grid size-[26px] shrink-0 place-items-center rounded-full border-[3px] border-background bg-primary text-white"
                  }
               >
                  <Icons.check
                     strokeWidth={3}
                     className="size-4"
                  />
               </span>
               <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="-ml-1 flex w-full cursor-pointer items-center gap-1 rounded-full px-2 py-1.5 text-start text-foreground/75 transition-colors hover:bg-border/50"
               >
                  <span>
                     <strong className="font-semibold">
                        {delayedResolvedBy?.name}
                     </strong>{" "}
                     resolved comment
                  </span>
                  <span className="ml-auto flex items-center gap-1">
                     {isExpanded ? "Collapse" : "Expand"}
                     <Icons.chevronDown
                        data-expanded={isExpanded}
                        className="mt-px size-5 data-[expanded=true]:rotate-180"
                     />
                  </span>
               </button>
            </div>
         </TransitionHeight>
      </div>
   )
}

function useDelayedValue<T>(value: T, delayTime: number): T {
   const [delayedValue, setDelayedValue] = useState<T>(value)

   useEffect(() => {
      let timeoutId: NodeJS.Timeout

      match(value)
         .with(P.nullish, () => {
            timeoutId = setTimeout(() => {
               setDelayedValue(value)
            }, delayTime) as unknown as never
         })
         .otherwise(() => {
            setDelayedValue(value)
         })

      return () => clearTimeout(timeoutId)
   }, [value, delayTime])

   return delayedValue
}
