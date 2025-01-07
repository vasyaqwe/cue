import type { CommentEvent } from "@/comment/types"
import { createSelectors } from "@/misc/utils"
import type PartySocket from "partysocket"
import { create } from "zustand"

type State = {
   socket: PartySocket | null
   sendEvent: (event: CommentEvent) => void
   createCommentEditorFocused: boolean
}

const store = create<State>()((_set, get) => ({
   socket: null,
   sendEvent: (event: CommentEvent) => {
      get().socket?.send(JSON.stringify(event))
   },
   createCommentEditorFocused: false,
}))

export const useCommentStore = createSelectors(store)
export const useCommentStoreBase = store
