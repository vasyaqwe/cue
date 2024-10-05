import * as comment from "@/comment/functions"
import { useCommentQueryMutator } from "@/comment/hooks/use-comment-query-mutator"
import { commentListQuery } from "@/comment/queries"
import { useCommentStore } from "@/comment/store"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useInsertComment() {
   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()
   const { issueId } = useParams({ from: "/$slug/_layout/issue/$issueId" })
   const sendEvent = useCommentStore().sendEvent

   const insertFn = useServerFn(comment.insert)
   const { insertCommentToQueryData } = useCommentQueryMutator()

   const insertComment = useMutation({
      mutationFn: insertFn,
      onMutate: async (input) => {
         await queryClient.cancelQueries(
            commentListQuery({ organizationId, issueId }),
         )

         const data = queryClient.getQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
         )

         insertCommentToQueryData({
            input: {
               id: crypto.randomUUID(),
               content: input.content ?? "",
               issueId,
               author: {
                  id: user.id,
                  avatarUrl: user.avatarUrl,
                  name: user.name,
               },
               createdAt: Date.now(),
            },
         })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
            context?.data,
         )
         toast.error("Failed to submit comment")
      },
      onSettled: (comment, error) => {
         queryClient.invalidateQueries(
            commentListQuery({ organizationId, issueId }),
         )
         if (error || !comment) return

         sendEvent({
            type: "insert",
            comment: {
               id: comment.id,
               content: comment.content ?? "",
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
      },
   })

   return {
      insertComment,
   }
}
