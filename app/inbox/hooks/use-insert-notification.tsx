import * as notification from "@/inbox/functions"
import { inboxListQuery } from "@/inbox/queries"
import { useInboxStore } from "@/inbox/store"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"

export function useInsertNotification() {
   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()
   const sendEvent = useInboxStore().sendEvent

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
               issue: {
                  title: notification.issue.title,
                  status: notification.issue.status,
               },
               sender: {
                  id: user.id,
                  avatarUrl: user.avatarUrl,
               },
            },
         })

         queryClient.invalidateQueries(inboxListQuery({ organizationId }))
      },
   })

   return {
      insertNotification,
   }
}
