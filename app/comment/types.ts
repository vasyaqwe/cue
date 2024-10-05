import type * as comment from "./functions"

export type CommentEvent =
   | {
        type: "insert"
        comment: Awaited<ReturnType<typeof comment.list>>[number]
        senderId: string
     }
   | {
        type: "delete"
        commentId: string
        issueId: string
        senderId: string
     }
