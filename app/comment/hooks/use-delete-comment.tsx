import * as comment from "@/comment/functions"
import { useCommentQueryMutator } from "@/comment/hooks/use-comment-query-mutator"
import { commentListQuery } from "@/comment/queries"
import { useCommentStore } from "@/comment/store"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useDeleteComment() {
   const queryClient = useQueryClient()
   const sendEvent = useCommentStore().sendEvent
   const { issueId } = useParams({ strict: false })
   if (!issueId)
      throw new Error("useInsertComment must be used in an $issueId route")

   const { organizationId, user } = useAuth()
   const { deleteCommentFromQueryData } = useCommentQueryMutator()

   const deleteFn = useServerFn(comment.deleteFn)
   const deleteComment = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ commentId }) => {
         sendEvent({
            type: "delete",
            commentId,
            senderId: user.id,
            issueId,
         })

         await queryClient.cancelQueries(
            commentListQuery({ organizationId, issueId }),
         )

         const data = queryClient.getQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
         )

         deleteCommentFromQueryData({ commentId, issueId })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
            context?.data,
         )
         toast.error("Failed to delete comment")
      },
      onSettled: (_, _error, _data) => {
         queryClient.invalidateQueries(
            commentListQuery({ organizationId, issueId }),
         )
      },
   })

   return {
      deleteComment,
   }
}
