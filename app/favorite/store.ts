import { createSelectors } from "@/misc/utils"
import { create } from "zustand"

type StoreState = {
   isMounted: boolean
}

const store = create<StoreState>()(() => ({
   isMounted: false,
}))

export const useFavoriteStore = createSelectors(store)
