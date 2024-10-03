import * as notification from "@/inbox/functions"
import { useNotificationQueryMutator } from "@/inbox/hooks/use-notification-query-mutator"
import { inboxListQuery } from "@/inbox/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useDeleteNotification() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()
   const { deleteNotificationFromQueryData } = useNotificationQueryMutator()

   const deleteFn = useServerFn(notification.deleteFn)
   const deleteNotification = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ notificationId }) => {
         await queryClient.cancelQueries(inboxListQuery({ organizationId }))

         const data = queryClient.getQueryData(
            inboxListQuery({ organizationId }).queryKey,
         )

         deleteNotificationFromQueryData({ notificationId })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            inboxListQuery({ organizationId }).queryKey,
            context?.data,
         )
         toast.error("Failed to delete notification")
      },
      onSettled: (_, _error, _data) => {
         queryClient.invalidateQueries(inboxListQuery({ organizationId }))
      },
   })

   return {
      deleteNotification,
   }
}
