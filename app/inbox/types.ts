import type * as notification from "./functions"

export type NotificationEvent = {
   type: "insert"
   notification: Awaited<ReturnType<typeof notification.list>>[number]
}
