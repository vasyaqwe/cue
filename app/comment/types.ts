import type { updateCommentParams } from "@/comment/schema"
import type { z } from "zod"
import type * as comment from "./functions"

export type UpdateCommentEventInput = z.infer<typeof updateCommentParams> & {
   resolvedBy?: Awaited<ReturnType<typeof comment.list>>[number]["resolvedBy"]
}

export type InsertCommentEventInput = Awaited<
   ReturnType<typeof comment.list>
>[number]

export type CommentEvent =
   | {
        type: "insert"
        comment: InsertCommentEventInput
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
