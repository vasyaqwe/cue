import * as comment from "@/comment/functions"
import { commentListQuery } from "@/comment/queries"
import { useCommentStore } from "@/comment/store"
import type { UpdateCommentEventInput } from "@/comment/types"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { produce } from "immer"
import { toast } from "sonner"
import { match } from "ts-pattern"

export function useUpdateComment() {
   const { issueId } = useParams({ strict: false })
   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()

   const sendCommentEvent = useCommentStore().sendEvent

   const updateCommentInQueryData = ({
      input,
   }: {
      input: UpdateCommentEventInput
   }) => {
      queryClient.setQueryData(
         commentListQuery({ organizationId, issueId: input.issueId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) =>
                  produce(data, (draft) => {
                     match(draft?.find((comment) => comment.id === input.id))
                        .with(undefined, () => {})
                        .otherwise((comment) => {
                           if (!input.resolvedById) comment.resolvedBy = null
                           if (input.resolvedById && input.resolvedBy) {
                              comment.resolvedBy = input.resolvedBy
                           }
                        })
                  }),
               ),
      )
   }

   const updateFn = useServerFn(comment.update)
   const updateComment = useMutation({
      mutationFn: updateFn,
      onMutate: async (input) => {
         if (!issueId)
            throw new Error(
               "updateComment mutation must be used in an $issueId route",
            )

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
         if (!issueId)
            throw new Error(
               "updateComment mutation must be used in an $issueId route",
            )

         queryClient.setQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
            context?.data,
         )
         toast.error("Failed to update comment")
      },
      onSettled: (_, error, comment) => {
         if (!issueId)
            throw new Error(
               "updateComment mutation must be used in an $issueId route",
            )

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
      updateCommentInQueryData,
   }
}
