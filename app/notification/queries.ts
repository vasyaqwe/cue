import { queryOptions } from "@tanstack/react-query"
import * as notification from "./functions"

export const notificationListQuery = (input: {
   organizationId: string
}) =>
   queryOptions({
      queryKey: ["notification_list", input.organizationId],
      queryFn: () => notification.list({ data: input }),
   })

export const notificationUnreadCountQuery = (input: {
   organizationId: string
}) =>
   queryOptions({
      queryKey: ["notification_unread_count", input.organizationId],
      queryFn: () => notification.unreadCount({ data: input }),
   })
