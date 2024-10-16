import { createSelectors } from "@/utils/misc"
import { create } from "zustand"

type StoreState = {
   isMobile: boolean
   fileTriggerOpen: boolean
}

const store = create<StoreState>()(() => ({
   isMobile: true,
   fileTriggerOpen: false,
}))

export const useUIStore = createSelectors(store)
