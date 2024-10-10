import type { NotificationEvent } from "@/notification/types"
import { createSelectors } from "@/utils/misc"
import type PartySocket from "partysocket"
import { create } from "zustand"

type State = {
   socket: PartySocket | null
   sendEvent: (event: NotificationEvent) => void
   isRefreshing: boolean
   activeItemIssueId: string | null
}

const store = create<State>()((_set, get) => ({
   socket: null,
   sendEvent: (event: NotificationEvent) => {
      get().socket?.send(JSON.stringify(event))
   },
   isRefreshing: false,
   activeItemIssueId: null,
}))

export const useNotificationStore = createSelectors(store)
export const useNotificationStoreBase = store
