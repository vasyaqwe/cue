import type { updateNotificationParams } from "@/notification/schema"
import type { z } from "zod"
import type * as notification from "./functions"

export type NotificationEvent =
   | {
        type: "insert"
        notification: Awaited<ReturnType<typeof notification.list>>[number]
        senderId: string
     }
   | {
        type: "issue_update"
        issue: z.infer<typeof updateNotificationParams>["issue"] & {
           id: string
        }
        senderId: string
     }
   | {
        type: "issue_mention_delete"
        receiverIds: string[] | undefined
        senderId: string
        issueId: string
     }
