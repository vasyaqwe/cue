import type * as notificationFns from "@/inbox/functions"
import { inboxListQuery } from "@/inbox/queries"
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
               return draft?.filter(
                  (notification) => notification.id !== notificationId,
               )
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
   }

   const updateNotificationsInQueryData = ({
      input,
   }: {
      input: z.infer<typeof updateNotificationParams>
   }) => {
      queryClient.setQueryData(
         inboxListQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData
            return produce(oldData, (draft) => {
               for (const notification of draft) {
                  if (input.ids.includes(notification.id)) {
                     notification.isRead = input.isRead
                  }
               }
            })
         },
      )
   }

   return {
      deleteNotificationFromQueryData,
      insertNotificationToQueryData,
      updateNotificationsInQueryData,
   }
}
