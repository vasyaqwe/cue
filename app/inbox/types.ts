import type { updateNotificationParams } from "@/inbox/schema"
import type { z } from "zod"
import type * as notification from "./functions"

export type NotificationEvent =
   | {
        type: "insert"
        notification: Awaited<ReturnType<typeof notification.list>>[number]
        senderId: string
     }
   | {
        type: "update"
        issue: z.infer<typeof updateNotificationParams>["issue"] & {
           id: string
        }
        senderId: string
     }
