import * as notification from "@/inbox/functions"
import { useNotificationQueryMutator } from "@/inbox/hooks/use-notification-query-mutator"
import { inboxListQuery } from "@/inbox/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useUpdateNotification() {
   const queryClient = useQueryClient()
   // const { sendEvent } = useNotificationSocket()
   const { organizationId } = useAuth()
   const { updateNotificationInQueryData } = useNotificationQueryMutator()

   const updateFn = useServerFn(notification.update)
   const updateNotification = useMutation({
      mutationFn: updateFn,
      onMutate: async (input) => {
         await queryClient.cancelQueries(inboxListQuery({ organizationId }))

         const data = queryClient.getQueryData(
            inboxListQuery({ organizationId }).queryKey,
         )

         updateNotificationInQueryData({ input })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            inboxListQuery({ organizationId }).queryKey,
            context?.data,
         )
         toast.error("Error, please try again")
      },
      onSettled: (_, _error, _notification) => {
         queryClient.invalidateQueries(inboxListQuery({ organizationId }))
      },
   })

   return {
      updateNotification,
   }
}
