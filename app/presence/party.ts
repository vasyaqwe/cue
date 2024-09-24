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

      if (userId) {
         this.onlineUsers.set(userId, connection.id)

         const event = {
            type: "user_online",
            userId,
         } satisfies PresenceEvent

         this.room.broadcast(JSON.stringify(event))
      }
   }

   onClose(connection: Party.Connection) {
      let disconnectedUserId: string | undefined

      for (const [userId, connectionId] of this.onlineUsers.entries()) {
         if (connectionId === connection.id) {
            disconnectedUserId = userId
            break
         }
      }

      if (disconnectedUserId) {
         this.onlineUsers.delete(disconnectedUserId)

         const event = {
            type: "user_offline",
            userId: disconnectedUserId,
         } satisfies PresenceEvent
         this.room.broadcast(JSON.stringify(event))
      }
   }

   onMessage(message: string, _sender: Party.Connection<unknown>) {
      const data: PresenceEvent = JSON.parse(message)

      if (data.type === "get_online_users") {
         const onlineUsers = Array.from(this.onlineUsers.keys())
         const event = {
            type: "online_users",
            onlineUsers,
         } satisfies PresenceEvent

         this.room.broadcast(JSON.stringify(event))
      }
   }
}
