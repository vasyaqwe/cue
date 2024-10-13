import type { Node } from "@tiptap/pm/model"

export const getMentionedUserIds = (string: string) => {
   const matches = string.matchAll(/userid="([^"]+)"/g)
   return [...matches].map((match) => match[1])
}

// Helper function to get mentions from a document
export const getMentionsFromDoc = (doc: Node) => {
   const mentions: {
      userId: string
      label: string
   }[] = []
   doc.descendants((node) => {
      if (node.type.name === "mention") {
         mentions.push(node.attrs as never)
      }
   })
   return mentions
}
