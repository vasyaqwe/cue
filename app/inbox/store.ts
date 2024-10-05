import type { NotificationEvent } from "@/inbox/types"
import { createSelectors } from "@/utils/misc"
import type PartySocket from "partysocket"
import { create } from "zustand"

type State = {
   socket: PartySocket | null
   sendEvent: (event: NotificationEvent) => void
   isRefreshing: boolean
   activeItemId: string | null
}

const store = create<State>()((_set, get) => ({
   socket: null,
   sendEvent: (event: NotificationEvent) => {
      const socket = get().socket
      if (!socket) return
      socket.send(JSON.stringify(event))
   },
   isRefreshing: false,
   activeItemId: null,
}))

export const useInboxStore = createSelectors(store)
export const useInboxStoreBase = store
