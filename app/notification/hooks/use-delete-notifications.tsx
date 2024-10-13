import * as notification from "@/notification/functions"
import {
   notificationListQuery,
   notificationUnreadCountQuery,
} from "@/notification/queries"
import { useNotificationStore } from "@/notification/store"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { produce } from "immer"
import { toast } from "sonner"
import { P, match } from "ts-pattern"

export function useDeleteNotifications() {
   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()

   const sendEvent = useNotificationStore().sendEvent

   const deleteNotificationsFromQueryData = ({
      issueIds,
      notificationId,
   }: {
      issueIds: string[] | undefined
      notificationId: string | undefined
   }) => {
      let unreadCountToRemove = 0

      queryClient.setQueryData(
         notificationListQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) =>
                  produce(data, (draft) => {
                     match({ notificationId, issueIds })
                        .with(
                           {
                              notificationId: P.not(undefined),
                           },
                           ({ notificationId }) => {
                              const notificationIndex = draft.findIndex(
                                 (notification) =>
                                    notification.id === notificationId,
                              )
                              if (notificationIndex !== -1) {
                                 const notification = draft[notificationIndex]
                                 if (!notification?.isRead)
                                    unreadCountToRemove++
                                 draft.splice(notificationIndex, 1)
                              }
                           },
                        )
                        .with(
                           { issueIds: P.not(undefined) },
                           ({ issueIds }) => {
                              for (let i = draft.length - 1; i >= 0; i--) {
                                 const notification = draft[i]
                                 if (
                                    notification &&
                                    issueIds.includes(notification.issueId)
                                 ) {
                                    if (!notification.isRead)
                                       unreadCountToRemove++
                                    draft.splice(i, 1)
                                 }
                              }
                           },
                        )
                  }),
               ),
      )

      if (unreadCountToRemove > 0) {
         queryClient.setQueryData(
            notificationUnreadCountQuery({ organizationId }).queryKey,
            (oldData) =>
               match(oldData)
                  .with(undefined, (data) => data)
                  .otherwise((data) => ({
                     count: Math.max(data.count - unreadCountToRemove, 0),
                  })),
         )
      }
   }

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

         // only if you are deleting your own notifications
         match(receiverIds).with([], () =>
            deleteNotificationsFromQueryData({
               issueIds,
               notificationId: undefined,
            }),
         )

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
      deleteNotificationsFromQueryData,
   }
}
