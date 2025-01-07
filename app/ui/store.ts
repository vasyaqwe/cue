import { createSelectors } from "@/misc/utils"
import { create } from "zustand"

type StoreState = {
   isMobile: boolean
   fileTriggerOpen: boolean
   isMounted: boolean
}

const store = create<StoreState>()(() => ({
   isMobile: true,
   fileTriggerOpen: false,
   isMounted: false,
}))

export const useUIStore = createSelectors(store)
