import { env } from "@/env"
import { useNotificationQueryMutator } from "@/inbox/hooks/use-notification-query-mutator"
import type { NotificationEvent } from "@/inbox/types"
import { useAuth } from "@/user/hooks"
import PartySocket from "partysocket"
import { useCallback, useEffect, useState } from "react"

let notificationSocketInstance: PartySocket | null = null
let currentRoom: string | null = null

const getSocketInstance = ({ room }: { room: string }) => {
   if (notificationSocketInstance && currentRoom === room) {
      return notificationSocketInstance
   }

   if (notificationSocketInstance) {
      notificationSocketInstance.close()
   }

   notificationSocketInstance = new PartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "inbox",
      room,
   })
   currentRoom = room

   return notificationSocketInstance
}

export function useNotificationSocket() {
   const { organizationId, user } = useAuth()
   const { insertNotificationToQueryData } = useNotificationQueryMutator()
   const [isReady, setIsReady] = useState(false)

   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   useEffect(() => {
      const connection = getSocketInstance({
         room: organizationId,
      })

      const message = (event: MessageEvent<string>) => {
         const message: NotificationEvent = JSON.parse(event.data)
         if (message.notification.sender.id === user.id) return
         if (message.type === "insert") {
            return insertNotificationToQueryData({
               input: message.notification,
            })
         }
      }

      const open = () => setIsReady(true)
      const close = () => setIsReady(false)

      connection.addEventListener("message", message)
      connection.addEventListener("open", open)
      connection.addEventListener("close", close)

      setIsReady(connection.readyState === WebSocket.OPEN)

      return () => {
         connection.removeEventListener("message", message)
         connection.removeEventListener("open", open)
         connection.removeEventListener("close", close)
      }
   }, [organizationId, user.id])

   const sendEvent = useCallback(
      (event: NotificationEvent) => {
         const connection = notificationSocketInstance
         if (!connection || !isReady) {
            return console.log("Socket not ready, cannot send event")
         }
         connection.send(JSON.stringify(event))
      },
      [isReady],
   )

   return {
      sendEvent,
   }
}
