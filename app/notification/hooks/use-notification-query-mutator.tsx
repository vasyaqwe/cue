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

   return {
      deleteNotificationsFromQueryData,
      insertNotificationToQueryData,
      updateNotificationsInQueryData,
      updateIssuesInNotificationsQueryData,
   }
}
