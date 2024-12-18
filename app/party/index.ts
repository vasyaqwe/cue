import { logger } from "@/lib/logger"
import type { PartyKitServer } from "partykit/server"

export default {
   onConnect(_websocket, _room) {
      logger.info("no-op")
   },
} satisfies PartyKitServer
