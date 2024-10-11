import { createSelectors } from "@/utils/misc"
import type { Range } from "@tiptap/core"
import { create } from "zustand"

type State = {
   query: string
   range: Range | null
   mentionedUserIds: string[]
   unmentionedUserIds: string[]
}

type Actions = {
   addMentionedUserId: (id: string) => void
   removeMentionedUserId: (id: string) => void
}

const store = create<State & Actions>()(() => ({
   query: "",
   range: null,
   mentionedUserIds: [],
   unmentionedUserIds: [],
   addMentionedUserId: (id) => {
      store.setState((state) => ({
         mentionedUserIds: Array.from(new Set([...state.mentionedUserIds, id])),
         unmentionedUserIds: state.unmentionedUserIds.filter(
            (userId) => userId !== id,
         ),
      }))
   },
   removeMentionedUserId: (id) => {
      store.setState((state) => ({
         unmentionedUserIds: Array.from(
            new Set([...state.unmentionedUserIds, id]),
         ),
         mentionedUserIds: state.mentionedUserIds.filter(
            (userId) => userId !== id,
         ),
      }))
   },
}))

export const useEditorStore = createSelectors(store)
export const useEditorStoreBase = store
