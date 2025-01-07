import type { IssueEvent, IssueView } from "@/issue/types"
import { createSelectors } from "@/misc/utils"
import type PartySocket from "partysocket"
import { create } from "zustand"

type State = {
   socket: PartySocket | null
   sendEvent: (event: IssueEvent) => void
   isRefreshing: boolean
   lastVisitedView: IssueView
}

const store = create<State>()((_set, get) => ({
   socket: null,
   sendEvent: (event: IssueEvent) => {
      get().socket?.send(JSON.stringify(event))
   },
   isRefreshing: false,
   lastVisitedView: "all",
}))

export const useIssueStore = createSelectors(store)
export const useIssueStoreBase = store
