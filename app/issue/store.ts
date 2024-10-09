import type { IssueEvent } from "@/issue/types"
import { createSelectors } from "@/utils/misc"
import type PartySocket from "partysocket"
import { create } from "zustand"

type State = {
   socket: PartySocket | null
   sendEvent: (event: IssueEvent) => void
   isRefreshing: boolean
}

const store = create<State>()((_set, get) => ({
   socket: null,
   sendEvent: (event: IssueEvent) => {
      get().socket?.send(JSON.stringify(event))
   },
   isRefreshing: false,
}))

export const useIssueStore = createSelectors(store)
export const useIssueStoreBase = store
