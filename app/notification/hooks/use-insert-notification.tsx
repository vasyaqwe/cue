import * as notification from "@/notification/functions"
import {
   notificationListQuery,
   notificationUnreadCountQuery,
} from "@/notification/queries"
import { useNotificationStore } from "@/notification/store"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { P, match } from "ts-pattern"

export function useInsertNotification() {
   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()
   const sendEvent = useNotificationStore().sendEvent

   const insertNotificationToQueryData = ({
      input,
   }: { input: Awaited<ReturnType<typeof notification.list>>[number] }) => {
      queryClient.setQueryData(
         notificationListQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) => [input, ...data]),
      )
      queryClient.setQueryData(
         notificationUnreadCountQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) => ({
                  count: data.count + 1,
               })),
      )
   }

   const insertFn = useServerFn(notification.insert)
   const insertNotification = useMutation({
      mutationFn: insertFn,
      onSuccess: (notification) => {
         queryClient.invalidateQueries(
            notificationListQuery({ organizationId }),
         )

         match(notification).with({ id: P.not(undefined) }, (notif) =>
            sendEvent({
               type: "insert",
               notification: {
                  id: notif.id,
                  content: notif.content,
                  createdAt: notif.createdAt,
                  isRead: false,
                  issueId: notif.issueId,
                  type: notif.type,
                  commentId: notif.commentId,
                  issue: {
                     title: notif.issue.title,
                     status: notif.issue.status,
                  },
                  sender: {
                     id: user.id,
                     name: user.name,
                     avatarUrl: user.avatarUrl,
                  },
               },
               senderId: user.id,
            }),
         )
      },
   })

   return {
      insertNotification,
      insertNotificationToQueryData,
   }
}
