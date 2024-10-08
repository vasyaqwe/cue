import type * as commentFns from "@/comment/functions"
import { commentListQuery } from "@/comment/queries"
import type { UpdateCommentEventInput } from "@/comment/types"
import { useNotificationQueryMutator } from "@/notification/hooks/use-notification-query-mutator"
import { notificationListQuery } from "@/notification/queries"
import { useAuth } from "@/user/hooks"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { produce } from "immer"
import { match } from "ts-pattern"

export function useCommentQueryMutator() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const notificatons = useSuspenseQuery(
      notificationListQuery({ organizationId }),
   )
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
      match(notificatons.data)
         .with([], () => undefined)
         .otherwise((data) =>
            match(
               data.filter(
                  (notification) => notification.commentId === commentId,
               ),
            )
               .with([], () => undefined)
               .otherwise((notificationsToDelete) =>
                  deleteNotificationsFromQueryData({
                     notificationIds: notificationsToDelete.map(
                        (notification) => notification.id,
                     ),
                  }),
               ),
         )
   }

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
                        .with(undefined, () => undefined)
                        .otherwise((comment) =>
                           Object.assign(comment, {
                              resolvedBy: input.resolvedById
                                 ? input.resolvedBy
                                 : null,
                           }),
                        )
                  }),
               ),
      )
   }

   const insertCommentToQueryData = ({
      input,
   }: { input: Awaited<ReturnType<typeof commentFns.list>>[number] }) => {
      queryClient.setQueryData(
         commentListQuery({ organizationId, issueId: input.issueId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) => [...data, input]),
      )
   }

   return {
      insertCommentToQueryData,
      updateCommentInQueryData,
      deleteCommentFromQueryData,
   }
}
