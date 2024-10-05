import { queryOptions } from "@tanstack/react-query"
import * as comment from "./functions"

export const commentListQuery = (input: {
   organizationId: string
   issueId: string
}) =>
   queryOptions({
      queryKey: ["comment_list", input.issueId],
      queryFn: () => comment.list(input),
   })
