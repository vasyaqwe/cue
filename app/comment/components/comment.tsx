import type * as commentFns from "@/comment/functions"
import { useDeleteComment } from "@/comment/hooks/use-delete-comment"
import { Button } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { Tooltip } from "@/ui/components/tooltip"
import { UserAvatar } from "@/ui/components/user-avatar"
import { useAuth } from "@/user/hooks"
import { formatDateRelative } from "@/utils/format"
import { useParams } from "@tanstack/react-router"

export function Comment({
   comment,
}: { comment: Awaited<ReturnType<typeof commentFns.list>>[number] }) {
   const { issueId } = useParams({ strict: false })
   if (!issueId) throw new Error("Comment must be used in an $issueId route")

   const { user } = useAuth()
   const { deleteComment } = useDeleteComment()

   return (
      <div
         className="group relative mt-3 flex gap-3 py-2"
         key={comment.id}
      >
         <UserAvatar user={comment.author} />
         <div className="flex-1">
            <div className="-mt-[4px] flex max-h-[22px] items-center justify-between">
               <p className="line-clamp-1">
                  <strong className="mr-1 font-semibold ">
                     {comment.author.name}
                  </strong>
                  <small className="text-foreground/70 text-sm">
                     {formatDateRelative(comment.createdAt, "narrow")}
                  </small>
               </p>
               <div className="-top-2 right-0 flex items-center rounded-full p-0.5 transition-opacity md:pointer-events-none md:group-hover:pointer-events-auto md:absolute md:group-hover:opacity-100 md:opacity-0 md:shadow-button">
                  <Tooltip content="Resolve comment">
                     <Button
                        aria-label="Resolve comment"
                        variant={"ghost"}
                        size={"icon-sm"}
                     >
                        <Icons.reload className="size-[18px]" />
                     </Button>
                  </Tooltip>
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
   )
}
