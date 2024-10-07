import type { updateCommentParams } from "@/comment/schema"
import type { z } from "zod"
import type * as comment from "./functions"

export type UpdateCommentEventInput = z.infer<typeof updateCommentParams> & {
   resolvedBy?: Awaited<ReturnType<typeof comment.list>>[number]["resolvedBy"]
}

export type CommentEvent =
   | {
        type: "insert"
        comment: Awaited<ReturnType<typeof comment.list>>[number]
        senderId: string
        issueTitle: string
     }
   | {
        type: "update"
        comment: UpdateCommentEventInput
        issueId: string
        senderId: string
     }
   | {
        type: "delete"
        commentId: string
        issueId: string
        senderId: string
     }
