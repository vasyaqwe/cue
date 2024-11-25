import type { MentionContextType as MentionContext } from "@/ui/components/editor/mention/context"
import { createSelectors } from "@/utils/misc"
import type { Range } from "@tiptap/core"
import { create } from "zustand"

type MentionContextType = NonNullable<MentionContext>

type State = {
   query: string
   range: Range | null
   mentionedUsers: Record<MentionContextType, Set<string>>
   unmentionedUsers: Record<MentionContextType, Set<string>>
   pendingMentions: Record<MentionContextType, Set<string>>
   mentionPopoverOpen: boolean
}

type Actions = {
   addMentionedUser: (context: MentionContextType, userId: string) => void
   removeMentionedUser: (context: MentionContextType, userId: string) => void
   getMentionedUserIds: (context: MentionContextType) => string[]
   getUnmentionedUserIds: (context: MentionContextType) => string[]
   setPendingMentions: (context: MentionContextType) => void
   getPendingMentionedUserIds: (context: MentionContextType) => string[]
   clearMentions: (context: MentionContextType) => void
}

const store = create<State & Actions>()((set, get) => ({
   query: "",
   range: null,
   mentionPopoverOpen: false,
   mentionedUsers: {
      issue: new Set<string>(),
      comment: new Set<string>(),
   },
   unmentionedUsers: {
      issue: new Set<string>(),
      comment: new Set<string>(),
   },
   pendingMentions: {
      issue: new Set<string>(),
      comment: new Set<string>(),
   },
   addMentionedUser: (context, userId) =>
      set((state) => ({
         mentionedUsers: {
            ...state.mentionedUsers,
            [context]: new Set(state.mentionedUsers[context]).add(userId),
         },
         unmentionedUsers: {
            ...state.unmentionedUsers,
            [context]: new Set(
               [...state.unmentionedUsers[context]].filter(
                  (id) => id !== userId,
               ),
            ),
         },
      })),
   removeMentionedUser: (context, userId) =>
      set((state) => ({
         mentionedUsers: {
            ...state.mentionedUsers,
            [context]: new Set(
               [...state.mentionedUsers[context]].filter((id) => id !== userId),
            ),
         },
         unmentionedUsers: {
            ...state.unmentionedUsers,
            [context]: new Set(state.unmentionedUsers[context]).add(userId),
         },
      })),
   getMentionedUserIds: (context) => [...get().mentionedUsers[context]],
   getUnmentionedUserIds: (context) => [...get().unmentionedUsers[context]],
   getPendingMentionedUserIds: (context) => [...get().pendingMentions[context]],
   setPendingMentions: (context) =>
      set((state) => ({
         pendingMentions: {
            ...state.pendingMentions,
            [context]: new Set(state.mentionedUsers[context]),
         },
      })),
   clearMentions: (context) =>
      set((state) => ({
         mentionedUsers: {
            ...state.mentionedUsers,
            [context]: new Set(),
         },
         pendingMentions: {
            ...state.pendingMentions,
            [context]: new Set(),
         },
         unmentionedUsers: {
            ...state.unmentionedUsers,
            [context]: new Set(),
         },
      })),
}))

export const useEditorStore = createSelectors(store)
export const useEditorStoreBase = store
