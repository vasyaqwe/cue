import { createContext, useContext } from "react"

export type MentionContextType = "issue" | "comment" | null

const MentionContext = createContext<MentionContextType>(null)

export const MentionProvider = MentionContext.Provider

export function useMentionContext() {
   const context = useContext(MentionContext)
   if (!context)
      throw new Error("useMentionContext must be used within a MentionProvider")
   return context
}
