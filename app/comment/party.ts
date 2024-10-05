import type { CommentEvent } from "@/comment/types"
import type * as Party from "partykit/server"

export default class CommentServer implements Party.Server {
   constructor(readonly room: Party.Room) {}

   async onMessage(message: string, _connection: Party.Connection<unknown>) {
      const event: CommentEvent = JSON.parse(message)
      return this.room.broadcast(JSON.stringify(event))
   }
}
