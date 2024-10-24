import { createSelectors } from "@/utils/misc"
import { create } from "zustand"

type StoreState = {
   isMounted: boolean
}

const store = create<StoreState>()(() => ({
   isMounted: false,
}))

export const useFavoriteStore = createSelectors(store)
