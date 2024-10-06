import type * as notificationFns from "@/inbox/functions"
import { inboxListQuery, inboxUnreadCountQuery } from "@/inbox/queries"
import type { updateNotificationParams } from "@/inbox/schema"
import { useAuth } from "@/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"
import type { z } from "zod"

export function useNotificationQueryMutator() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const deleteNotificationsFromQueryData = ({
      notificationIds,
   }: { notificationIds: string[] }) => {
      let unreadCountToRemove = 0

      queryClient.setQueryData(
         inboxListQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData

            return produce(oldData, (draft) => {
               for (const notificationId of notificationIds) {
                  const notificationIndex = draft?.findIndex(
                     (notification) => notification.id === notificationId,
                  )

                  if (notificationIndex === -1) continue

                  const notification = draft[notificationIndex]

                  draft.splice(notificationIndex, 1)

                  if (!notification?.isRead) unreadCountToRemove++
               }
            })
         },
      )

      if (unreadCountToRemove === 0) return

      queryClient.setQueryData(
         inboxUnreadCountQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData

            return {
               count: Math.max(oldData.count - unreadCountToRemove, 0),
            }
         },
      )
   }

   const insertNotificationToQueryData = ({
      input,
   }: { input: Awaited<ReturnType<typeof notificationFns.list>>[number] }) => {
      queryClient.setQueryData(
         inboxListQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData

            return [input, ...oldData]
         },
      )
      queryClient.setQueryData(
         inboxUnreadCountQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData
            return {
               count: oldData.count + 1,
            }
         },
      )
   }

   const updateNotificationsInQueryData = ({
      input,
   }: {
      input: z.infer<typeof updateNotificationParams>
   }) => {
      let unreadCountChange = 0

      queryClient.setQueryData(
         inboxListQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData || input.ids.length === 0) return oldData

            const { ids, isRead, issue } = input

            return produce(oldData, (draft) => {
               for (const notification of draft) {
                  if (ids.includes(notification.id)) {
                     const wasUnread = notification.isRead === false

                     Object.assign(notification, {
                        isRead:
                           isRead !== undefined ? isRead : notification.isRead,
                        issue: {
                           title: issue?.title ?? notification.issue?.title,
                           status: issue?.status ?? notification.issue?.status,
                        },
                     })

                     if (isRead !== undefined) {
                        if (isRead && wasUnread) unreadCountChange -= 1
                        if (!isRead && !wasUnread) unreadCountChange += 1
                     }
                  }
               }
            })
         },
      )

      queryClient.setQueryData(
         inboxUnreadCountQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData
            return {
               count: Math.max(oldData.count + unreadCountChange, 0),
            }
         },
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
         inboxListQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData

            return produce(oldData, (draft) => {
               for (const notification of draft) {
                  if (notification.issueId === updatedIssue.id) {
                     Object.assign(notification, {
                        issue: {
                           title:
                              updatedIssue?.title ?? notification.issue?.title,
                           status:
                              updatedIssue?.status ??
                              notification.issue?.status,
                        },
                     })
                  }
               }
            })
         },
      )
   }

   return {
      deleteNotificationsFromQueryData,
      insertNotificationToQueryData,
      updateNotificationsInQueryData,
      updateIssuesInNotificationsQueryData,
   }
}
