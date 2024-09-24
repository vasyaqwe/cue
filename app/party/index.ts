import type { PartyKitServer } from "partykit/server"

export default {
   onConnect(_websocket, _room) {
      console.log("no-op")
   },
} satisfies PartyKitServer
