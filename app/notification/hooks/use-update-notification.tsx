import * as notification from "@/notification/functions"
import {
   notificationListQuery,
   notificationUnreadCountQuery,
} from "@/notification/queries"
import type { updateNotificationParams } from "@/notification/schema"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { produce } from "immer"
import { toast } from "sonner"
import { P, match } from "ts-pattern"
import type { z } from "zod"

export function useUpdateNotification() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const updateNotificationsInQueryData = ({
      input,
   }: {
      input: z.infer<typeof updateNotificationParams>
   }) => {
      let unreadCountChange = 0

      queryClient.setQueryData(
         notificationListQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) => {
                  const { isRead, issue } = input

                  return produce(data, (draft) => {
                     for (const notification of draft) {
                        if (input.issueIds.includes(notification.issueId)) {
                           const wasUnread = notification.isRead === false

                           Object.assign(notification, {
                              isRead:
                                 isRead !== undefined
                                    ? isRead
                                    : notification.isRead,
                              issue: {
                                 title:
                                    issue?.title ?? notification.issue?.title,
                                 status:
                                    issue?.status ?? notification.issue?.status,
                              },
                           })
                           match(isRead).with(P.not(undefined), (isRead) => {
                              if (isRead && wasUnread) unreadCountChange -= 1
                              if (!isRead && !wasUnread) unreadCountChange += 1
                           })
                        }
                     }
                  })
               }),
      )

      queryClient.setQueryData(
         notificationUnreadCountQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) => ({
                  count: Math.max(data.count + unreadCountChange, 0),
               })),
      )
   }

   const updateIssuesInNotificationsQueryData = ({
      updatedIssue,
   }: {
      updatedIssue: z.infer<typeof updateNotificationParams>["issue"] & {
         id: string
      }
   }) => {
      queryClient.setQueryData(
         notificationListQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) =>
                  produce(data, (draft) => {
                     for (const notification of draft) {
                        if (notification.issueId === updatedIssue.id) {
                           notification.issue = {
                              title:
                                 updatedIssue.title ?? notification.issue.title,
                              status:
                                 updatedIssue.status ??
                                 notification.issue.status,
                           }
                        }
                     }
                  }),
               ),
      )
   }

   const updateFn = useServerFn(notification.update)
   const updateNotification = useMutation({
      mutationFn: updateFn,
      onMutate: async (input) => {
         await queryClient.cancelQueries(
            notificationListQuery({ organizationId }),
         )

         const data = queryClient.getQueryData(
            notificationListQuery({ organizationId }).queryKey,
         )

         updateNotificationsInQueryData({ input })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            notificationListQuery({ organizationId }).queryKey,
            context?.data,
         )
         toast.error("Error, please try again")
      },
      onSettled: (_, _error, _notification) => {
         queryClient.invalidateQueries(
            notificationListQuery({ organizationId }),
         )
      },
   })

   return {
      updateNotification,
      updateNotificationsInQueryData,
      updateIssuesInNotificationsQueryData,
   }
}
