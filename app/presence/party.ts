import type { PresenceEvent } from "@/presence/types"
import type * as Party from "partykit/server"

export default class PresenceServer implements Party.Server {
   onlineUsers: Map<string, string>

   constructor(readonly room: Party.Room) {
      this.onlineUsers = new Map()
   }

   static options: Party.ServerOptions = {
      hibernate: true,
   }

   onConnect(connection: Party.Connection, context: Party.ConnectionContext) {
      const url = new URL(context.request.url)
      const userId = url.searchParams.get("userId")

      if (!userId) return

      this.onlineUsers.set(userId, connection.id)

      const payload = {
         type: "user_online",
         userId,
      } satisfies PresenceEvent

      return this.room.broadcast(JSON.stringify(payload))
   }

   onClose(connection: Party.Connection) {
      let disconnectedUserId: string | undefined

      for (const [userId, connectionId] of this.onlineUsers.entries()) {
         if (connectionId === connection.id) {
            disconnectedUserId = userId
            break
         }
      }

      if (!disconnectedUserId) return

      this.onlineUsers.delete(disconnectedUserId)

      const payload = {
         type: "user_offline",
         userId: disconnectedUserId,
      } satisfies PresenceEvent

      return this.room.broadcast(JSON.stringify(payload))
   }

   onMessage(message: string, _sender: Party.Connection<unknown>) {
      const event: PresenceEvent = JSON.parse(message)

      if (event.type === "get_online_users") {
         const onlineUsers = Array.from(this.onlineUsers.keys())
         const payload = {
            type: "online_users",
            onlineUsers,
         } satisfies PresenceEvent

         return this.room.broadcast(JSON.stringify(payload))
      }
   }
}
