import * as notification from "@/notification/functions"
import { useNotificationQueryMutator } from "@/notification/hooks/use-notification-query-mutator"
import { notificationListQuery } from "@/notification/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useDeleteNotifications() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()
   const { deleteNotificationsFromQueryData } = useNotificationQueryMutator()

   const deleteFn = useServerFn(notification.deleteFn)
   const deleteNotifications = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ notificationIds }) => {
         await queryClient.cancelQueries(
            notificationListQuery({ organizationId }),
         )

         const data = queryClient.getQueryData(
            notificationListQuery({ organizationId }).queryKey,
         )

         deleteNotificationsFromQueryData({ notificationIds })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            notificationListQuery({ organizationId }).queryKey,
            context?.data,
         )
         toast.error("Failed to delete notification")
      },
      onSettled: (_, _error, _data) => {
         queryClient.invalidateQueries(
            notificationListQuery({ organizationId }),
         )
      },
   })

   return {
      deleteNotifications,
   }
}
