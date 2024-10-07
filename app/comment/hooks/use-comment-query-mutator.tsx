import type * as commentFns from "@/comment/functions"
import { commentListQuery } from "@/comment/queries"
import type { UpdateCommentEventInput } from "@/comment/types"
import { useNotificationQueryMutator } from "@/inbox/hooks/use-notification-query-mutator"
import { inboxListQuery } from "@/inbox/queries"
import { useAuth } from "@/user/hooks"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { produce } from "immer"

export function useCommentQueryMutator() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const notificatons = useSuspenseQuery(inboxListQuery({ organizationId }))
   const { deleteNotificationsFromQueryData } = useNotificationQueryMutator()

   const deleteCommentFromQueryData = ({
      commentId,
      issueId,
   }: { commentId: string; issueId: string }) => {
      queryClient.setQueryData(
         commentListQuery({ organizationId, issueId }).queryKey,
         (oldData) => oldData?.filter((comment) => comment.id !== commentId),
      )

      // delete notifications that have commentId === deleted comment id (due on onCascade delete)
      if (notificatons.data.length === 0) return

      const notificationsToDelete = notificatons.data.filter(
         (notification) => notification.commentId === commentId,
      )
      if (notificationsToDelete?.length === 0) return

      deleteNotificationsFromQueryData({
         notificationIds: notificationsToDelete.map(
            (notification) => notification.id,
         ),
      })
   }

   const updateCommentInQueryData = ({
      input,
   }: {
      input: UpdateCommentEventInput
   }) => {
      queryClient.setQueryData(
         commentListQuery({ organizationId, issueId: input.issueId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData

            return produce(oldData, (draft) => {
               const comment = draft?.find((comment) => comment.id === input.id)
               if (!comment) return

               Object.assign(comment, {
                  ...(input.resolvedById
                     ? {
                          resolvedBy: input.resolvedBy,
                       }
                     : { resolvedBy: null }),
               })
            })
         },
      )
   }

   const insertCommentToQueryData = ({
      input,
   }: { input: Awaited<ReturnType<typeof commentFns.list>>[number] }) => {
      queryClient.setQueryData(
         commentListQuery({ organizationId, issueId: input.issueId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData

            return [...oldData, input]
         },
      )
   }

   return {
      insertCommentToQueryData,
      updateCommentInQueryData,
      deleteCommentFromQueryData,
   }
}
