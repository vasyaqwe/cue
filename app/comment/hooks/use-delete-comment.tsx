import * as comment from "@/comment/functions"
import { commentListQuery } from "@/comment/queries"
import { useCommentStore } from "@/comment/store"
import { useDeleteNotifications } from "@/notification/hooks/use-delete-notifications"
import { notificationListQuery } from "@/notification/queries"
import { useAuth } from "@/user/hooks"
import {
   useMutation,
   useQueryClient,
   useSuspenseQuery,
} from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import { match } from "ts-pattern"

export function useDeleteComment() {
   const { issueId } = useParams({ strict: false })

   const queryClient = useQueryClient()
   const sendEvent = useCommentStore().sendEvent

   const { organizationId, user } = useAuth()

   const notificatons = useSuspenseQuery(
      notificationListQuery({ organizationId }),
   )
   const { deleteNotificationsFromQueryData } = useDeleteNotifications()

   const deleteCommentFromQueryData = ({
      commentId,
      issueId,
   }: { commentId: string; issueId: string }) => {
      queryClient.setQueryData(
         commentListQuery({ organizationId, issueId }).queryKey,
         (oldData) => oldData?.filter((comment) => comment.id !== commentId),
      )

      // delete notifications that have commentId === deleted comment id (due on onCascade delete)
      match(notificatons.data)
         .with([], () => {})
         .otherwise((data) =>
            match(
               data.find(
                  (notification) => notification.commentId === commentId,
               ),
            )
               .with(undefined, () => {})
               .otherwise((notificationToDelete) =>
                  deleteNotificationsFromQueryData({
                     notificationId: notificationToDelete.id,
                     issueIds: undefined,
                  }),
               ),
         )
   }

   const deleteFn = useServerFn(comment.deleteFn)
   const deleteComment = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ commentId }) => {
         if (!issueId)
            throw new Error(
               "deleteComment mutation must be used in an $issueId route",
            )

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
         if (!issueId)
            throw new Error(
               "deleteComment mutation must be used in an $issueId route",
            )

         queryClient.setQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
            context?.data,
         )
         toast.error("Failed to delete comment")
      },
      onSettled: (_, error, data) => {
         if (!issueId)
            throw new Error(
               "deleteComment mutation must be used in an $issueId route",
            )

         queryClient.invalidateQueries(
            commentListQuery({ organizationId, issueId }),
         )

         match(error).with(null, () =>
            sendEvent({
               type: "delete",
               commentId: data.commentId,
               senderId: user.id,
               issueId,
            }),
         )
      },
   })

   return {
      deleteComment,
      deleteCommentFromQueryData,
   }
}
