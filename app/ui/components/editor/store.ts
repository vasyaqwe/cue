import { createSelectors } from "@/utils/misc"
import type { Range } from "@tiptap/core"
import { create } from "zustand"

type State = {
   query: string
   range: Range | null
}

const store = create<State>()(() => ({
   query: "",
   range: null,
}))

export const useEditorStore = createSelectors(store)
export const useEditorStoreBase = store
