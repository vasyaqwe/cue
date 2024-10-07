import * as notification from "@/notification/functions"
import { notificationListQuery } from "@/notification/queries"
import { useNotificationStore } from "@/notification/store"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"

export function useInsertNotification() {
   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()
   const sendEvent = useNotificationStore().sendEvent

   const insertFn = useServerFn(notification.insert)
   const insertNotification = useMutation({
      mutationFn: insertFn,
      onSuccess: (notification) => {
         if (!notification?.id) return

         sendEvent({
            type: "insert",
            notification: {
               id: notification.id,
               content: notification.content,
               createdAt: notification.createdAt,
               isRead: false,
               issueId: notification.issueId,
               type: notification.type,
               commentId: notification.commentId,
               issue: {
                  title: notification.issue.title,
                  status: notification.issue.status,
               },
               sender: {
                  id: user.id,
                  name: user.name,
                  avatarUrl: user.avatarUrl,
               },
            },
            senderId: user.id,
         })

         queryClient.invalidateQueries(
            notificationListQuery({ organizationId }),
         )
      },
   })

   return {
      insertNotification,
   }
}
