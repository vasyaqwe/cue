import { createSelectors } from "@/misc/utils"
import { create } from "zustand"

type State = {
   onlineUserIds: Set<string>
}

type Actions = {
   setOnlineUserIds: (users: string[]) => void
   setUserOnline: (userId: string) => void
   setUserOffline: (userId: string) => void
   isUserOnline: (userId: string) => boolean
}

const store = create<State & Actions>()((set, get) => ({
   onlineUserIds: new Set(),
   setOnlineUserIds: (users) => set({ onlineUserIds: new Set(users) }),
   setUserOnline: (userId) =>
      set((state) => {
         const newOnlineUserIds = new Set(state.onlineUserIds).add(userId)

         return {
            onlineUserIds: newOnlineUserIds,
         }
      }),
   setUserOffline: (userId) =>
      set((state) => {
         const newOnlineUserIds = new Set(state.onlineUserIds)
         newOnlineUserIds.delete(userId)

         return {
            onlineUserIds: newOnlineUserIds,
         }
      }),
   isUserOnline: (userId) => get().onlineUserIds.has(userId),
}))

export const usePresenceStore = createSelectors(store)
export const usePresenceStoreBase = store
