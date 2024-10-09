import type { CommentEvent } from "@/comment/types"
import { createSelectors } from "@/utils/misc"
import type PartySocket from "partysocket"
import { create } from "zustand"

type State = {
   socket: PartySocket | null
   sendEvent: (event: CommentEvent) => void
}

const store = create<State>()((_set, get) => ({
   socket: null,
   sendEvent: (event: CommentEvent) => {
      get().socket?.send(JSON.stringify(event))
   },
}))

export const useCommentStore = createSelectors(store)
export const useCommentStoreBase = store
