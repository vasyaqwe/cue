import * as notification from "@/inbox/functions"
import { inboxListQuery } from "@/inbox/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"

export function useInsertNotification() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const insertFn = useServerFn(notification.insert)
   const insertNotification = useMutation({
      mutationFn: insertFn,
      onSettled: () => {
         queryClient.invalidateQueries(inboxListQuery({ organizationId }))
      },
   })

   return {
      insertNotification,
   }
}
