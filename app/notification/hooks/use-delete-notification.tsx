import * as notification from "@/notification/functions"
import { useNotificationQueryMutator } from "@/notification/hooks/use-notification-query-mutator"
import { notificationListQuery } from "@/notification/queries"
import { useNotificationStore } from "@/notification/store"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import { match } from "ts-pattern"

export function useDeleteNotifications() {
   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()
   const { deleteNotificationsFromQueryData } = useNotificationQueryMutator()

   const sendEvent = useNotificationStore().sendEvent

   const deleteFn = useServerFn(notification.deleteFn)
   const deleteNotifications = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ issueIds, receiverIds }) => {
         await queryClient.cancelQueries(
            notificationListQuery({ organizationId }),
         )

         const data = queryClient.getQueryData(
            notificationListQuery({ organizationId }).queryKey,
         )

         deleteNotificationsFromQueryData({
            issueIds,
            notificationId: undefined,
         })

         match(receiverIds)
            .with([], () => {})
            .otherwise((receiverIds) =>
               sendEvent({
                  type: "issue_mention_delete",
                  receiverIds,
                  senderId: user.id,
                  issueId: issueIds?.[0] ?? "",
               }),
            )

         return { data }
      },
      onError: (_err, data, context) => {
         queryClient.setQueryData(
            notificationListQuery({ organizationId }).queryKey,
            context?.data,
         )

         // only show toast if deleting your own notifications
         match(data.receiverIds).with([], () =>
            toast.error("Failed to delete notification"),
         )
      },
      onSettled: (_, _error, _data) => {
         queryClient.invalidateQueries(
            notificationListQuery({ organizationId }),
         )
      },
   })

   return {
      deleteNotifications,
   }
}
