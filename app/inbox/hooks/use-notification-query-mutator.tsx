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
         (oldData) => [...(oldData ?? []), input],
      )
   }

   const updateNotificationInQueryData = ({
      input,
   }: {
      input: z.infer<typeof updateNotificationParams>
   }) => {
      queryClient.setQueryData(
         inboxListQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData
            return produce(oldData, (draft) => {
               const notification = draft?.find(
                  (notification) => notification.id === input.id,
               )
               if (!notification) return

               Object.assign(notification, {
                  ...(input.isRead !== undefined && { isRead: input.isRead }),
               })
            })
         },
      )
   }

   return {
      deleteNotificationFromQueryData,
      insertNotificationToQueryData,
      updateNotificationInQueryData,
   }
}
