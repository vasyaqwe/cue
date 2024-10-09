import * as comment from "@/comment/functions"
import { useCommentQueryMutator } from "@/comment/hooks/use-comment-query-mutator"
import { commentListQuery } from "@/comment/queries"
import { useCommentStore } from "@/comment/store"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import { match } from "ts-pattern"

export function useUpdateComment() {
   const { issueId } = useParams({ strict: false })
   if (!issueId)
      throw new Error("useUpdateComment must be used in an $issueId route")

   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()

   const sendCommentEvent = useCommentStore().sendEvent
   const { updateCommentInQueryData } = useCommentQueryMutator()

   const updateFn = useServerFn(comment.update)
   const updateComment = useMutation({
      mutationFn: updateFn,
      onMutate: async (input) => {
         updateCommentInQueryData({
            input: {
               ...input,
               resolvedBy: {
                  avatarUrl: user.avatarUrl,
                  name: user.name,
               },
            },
         })

         await queryClient.cancelQueries(
            commentListQuery({ organizationId, issueId }),
         )

         const data = queryClient.getQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
         )

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
            context?.data,
         )
         toast.error("Failed to update comment")
      },
      onSettled: (_, error, comment) => {
         queryClient.invalidateQueries(
            commentListQuery({ organizationId, issueId }),
         )

         match(error).with(null, () => {
            sendCommentEvent({
               type: "update",
               comment: {
                  ...comment,
                  resolvedBy: {
                     avatarUrl: user.avatarUrl,
                     name: user.name,
                  },
               },
               senderId: user.id,
               issueId,
            })
         })
      },
   })

   return {
      updateComment,
   }
}
