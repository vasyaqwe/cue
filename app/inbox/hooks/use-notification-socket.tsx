import { env } from "@/env"
import { useNotificationQueryMutator } from "@/inbox/hooks/use-notification-query-mutator"
import { useInboxStore } from "@/inbox/store"
import type { NotificationEvent } from "@/inbox/types"
import { useAuth } from "@/user/hooks"
import usePartySocket from "partysocket/react"
import { useEffect } from "react"

export function useNotificationSocket() {
   const { organizationId, user } = useAuth()
   const {
      insertNotificationToQueryData,
      updateIssuesInNotificationsQueryData,
   } = useNotificationQueryMutator()

   const socket = usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "inbox",
      room: organizationId,
      onMessage(event) {
         const message: NotificationEvent = JSON.parse(event.data)
         if (message.senderId === user.id) return
         if (message.type === "insert") {
            return insertNotificationToQueryData({
               input: message.notification,
            })
         }
         if (message.type === "update") {
            return updateIssuesInNotificationsQueryData({
               updatedIssue: message.issue,
            })
         }
      },
   })

   useEffect(() => {
      if (!socket) return

      useInboxStore.setState({ socket })
   }, [socket])

   return null
}