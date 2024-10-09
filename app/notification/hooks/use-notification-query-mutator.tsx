import type * as notificationFns from "@/notification/functions"
import {
   notificationListQuery,
   notificationUnreadCountQuery,
} from "@/notification/queries"
import type { updateNotificationParams } from "@/notification/schema"
import { useAuth } from "@/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"
import { P, match } from "ts-pattern"
import type { z } from "zod"

export function useNotificationQueryMutator() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const deleteNotificationsFromQueryData = ({
      notificationIds,
   }: { notificationIds: string[] }) => {
      let unreadCountToRemove = 0

      queryClient.setQueryData(
         notificationListQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) =>
                  produce(data, (draft) => {
                     for (const notificationId of notificationIds) {
                        const notificationIndex = draft?.findIndex(
                           (notification) => notification.id === notificationId,
                        )

                        if (notificationIndex === -1) continue

                        const notification = draft[notificationIndex]

                        draft.splice(notificationIndex, 1)

                        if (!notification?.isRead) unreadCountToRemove++
                     }
                  }),
               ),
      )

      match(unreadCountToRemove)
         .with(0, () => {})
         .otherwise(() =>
            queryClient.setQueryData(
               notificationUnreadCountQuery({ organizationId }).queryKey,
               (oldData) =>
                  match(oldData)
                     .with(undefined, (data) => data)
                     .otherwise((data) => ({
                        count: Math.max(data.count - unreadCountToRemove, 0),
                     })),
            ),
         )
   }

   const insertNotificationToQueryData = ({
      input,
   }: { input: Awaited<ReturnType<typeof notificationFns.list>>[number] }) => {
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
                        if (input.ids.includes(notification.id)) {
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

   return {
      deleteNotificationsFromQueryData,
      insertNotificationToQueryData,
      updateNotificationsInQueryData,
      updateIssuesInNotificationsQueryData,
   }
}
