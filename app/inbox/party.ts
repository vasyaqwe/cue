import type { NotificationEvent } from "@/inbox/types"
import type * as Party from "partykit/server"

export default class InboxServer implements Party.Server {
   constructor(readonly room: Party.Room) {}

   async onMessage(message: string, _connection: Party.Connection<unknown>) {
      const event: NotificationEvent = JSON.parse(message)
      console.log(message, event)
      return this.room.broadcast(JSON.stringify(event))
   }
}
