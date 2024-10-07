import type { NotificationEvent } from "@/notification/types"
import type * as Party from "partykit/server"

export default class InboxServer implements Party.Server {
   constructor(readonly room: Party.Room) {}

   async onMessage(message: string, _connection: Party.Connection<unknown>) {
      const event: NotificationEvent = JSON.parse(message)
      return this.room.broadcast(JSON.stringify(event))
   }
}
