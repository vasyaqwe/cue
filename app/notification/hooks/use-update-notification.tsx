import * as notification from "@/notification/functions"
import { useNotificationQueryMutator } from "@/notification/hooks/use-notification-query-mutator"
import { notificationListQuery } from "@/notification/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useUpdateNotification() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()
   const { updateNotificationsInQueryData } = useNotificationQueryMutator()

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
   }
}
