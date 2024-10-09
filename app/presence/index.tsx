import { env } from "@/env"
import type { PresenceEvent } from "@/presence/types"
import { useAuth } from "@/user/hooks"
import { usePartySocket } from "partysocket/react"
import { match } from "ts-pattern"
import { usePresenceStore } from "./store"

export function Presence() {
   const { user, organizationId } = useAuth()
   const setUserOnline = usePresenceStore.use.setUserOnline()
   const setUserOffline = usePresenceStore.use.setUserOffline()
   const setOnlineUserIds = usePresenceStore.use.setOnlineUserIds()

   const socket = usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "presence",
      room: organizationId,
      query: { userId: user.id },
      onOpen() {
         const event: PresenceEvent = { type: "get_online_users" }
         socket.send(JSON.stringify(event))
      },
      onMessage(event) {
         const message: PresenceEvent = JSON.parse(event.data)

         return match(message)
            .with({ type: "get_online_users" }, () => {})
            .with({ type: "online_users" }, (msg) => {
               setOnlineUserIds(msg.onlineUsers)
            })
            .with({ type: "user_online" }, (msg) => {
               setUserOnline(msg.userId)
            })
            .with({ type: "user_offline" }, (msg) => {
               setUserOffline(msg.userId)
            })
            .exhaustive()
      },
   })

   return null
}
