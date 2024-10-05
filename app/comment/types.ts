import type * as comment from "./functions"

export type CommentEvent = {
   type: "insert"
   comment: Awaited<ReturnType<typeof comment.list>>[number]
   senderId: string
}
