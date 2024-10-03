import { queryOptions } from "@tanstack/react-query"
import * as notification from "./functions"

export const inboxListQuery = (input: {
   organizationId: string
}) =>
   queryOptions({
      queryKey: ["inbox_list", input.organizationId],
      queryFn: () => notification.list(input),
   })

export const inboxUnreadCountQuery = (input: {
   organizationId: string
}) =>
   queryOptions({
      queryKey: ["inbox_unread_count", input.organizationId],
      queryFn: () => notification.unreadCount(input),
   })
