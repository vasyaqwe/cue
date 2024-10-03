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

   const deleteNotificationFromQueryData = ({
      notificationId,
   }: { notificationId: string }) => {
      queryClient.setQueryData(
         inboxListQuery({ organizationId }).queryKey,
         (oldData) =>
            produce(oldData, (draft) => {
               return draft?.filter((notification) => {
                  if (
                     !notification.isRead &&
                     notification.id === notificationId
                  ) {
                     queryClient.setQueryData(
                        inboxUnreadCountQuery({ organizationId }).queryKey,
                        (oldData) => ({
                           count: (oldData?.count ?? 0) - 1,
                        }),
                     )
                  }
                  return notification.id !== notificationId
               })
            }),
      )
   }

   const insertNotificationToQueryData = ({
      input,
   }: { input: Awaited<ReturnType<typeof notificationFns.list>>[number] }) => {
      queryClient.setQueryData(
         inboxListQuery({ organizationId }).queryKey,
         (oldData) => [input, ...(oldData ?? [])],
      )
      queryClient.setQueryData(
         inboxUnreadCountQuery({ organizationId }).queryKey,
         (oldData) => ({
            count: (oldData?.count ?? 0) + 1,
         }),
      )
   }

   const updateNotificationsInQueryData = ({
      input,
   }: {
      input: z.infer<typeof updateNotificationParams>
   }) => {
      queryClient.setQueryData(
         inboxListQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData || input.ids.length === 0) return oldData

            const { ids, isRead, issue } = input

            return produce(oldData, (draft) => {
               for (const notification of draft) {
                  if (ids.includes(notification.id)) {
                     Object.assign(notification, {
                        ...(isRead && { isRead }),
                        issue: {
                           title: issue?.title ?? notification.issue?.title,
                           status: issue?.status ?? notification.issue?.status,
                        },
                     })
                  }
               }
            })
         },
      )

      const readCount = input.ids.length

      queryClient.setQueryData(
         inboxUnreadCountQuery({ organizationId }).queryKey,
         (oldData) => ({
            count: input.isRead
               ? (oldData?.count ?? 0) - readCount
               : (oldData?.count ?? 0) + readCount,
         }),
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
                  if (notification.issueId !== updatedIssue.id) return

                  Object.assign(notification, {
                     issue: {
                        title: updatedIssue?.title ?? notification.issue?.title,
                        status:
                           updatedIssue?.status ?? notification.issue?.status,
                     },
                  })
               }
            })
         },
      )
   }

   return {
      deleteNotificationFromQueryData,
      insertNotificationToQueryData,
      updateNotificationsInQueryData,
      updateIssuesInNotificationsQueryData,
   }
}
