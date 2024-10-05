import * as comment from "@/comment/functions"
import { commentListQuery } from "@/comment/queries"
import { useCommentStore } from "@/comment/store"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"

export function useInsertComment() {
   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()
   const { issueId } = useParams({ from: "/$slug/_layout/issue/$issueId" })
   const sendEvent = useCommentStore().sendEvent

   const insertFn = useServerFn(comment.insert)
   const insertComment = useMutation({
      mutationFn: insertFn,
      onSuccess: (comment) => {
         sendEvent({
            type: "insert",
            comment: {
               id: comment.id,
               content: comment.content,
               createdAt: comment.createdAt,
               issueId: comment.issueId,
               author: {
                  id: user.id,
                  avatarUrl: user.avatarUrl,
                  name: user.name,
               },
            },
            senderId: user.id,
         })

         queryClient.invalidateQueries(
            commentListQuery({ organizationId, issueId }),
         )
      },
   })

   return {
      insertComment,
   }
}
