import type { IssueEvent } from "@/issue/types"
import type * as Party from "partykit/server"

export default class IssueServer implements Party.Server {
   constructor(readonly room: Party.Room) {}

   async onMessage(message: string, _connection: Party.Connection<unknown>) {
      const event: IssueEvent = JSON.parse(message)
      return this.room.broadcast(JSON.stringify(event))
   }
}
