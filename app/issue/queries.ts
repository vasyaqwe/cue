import { queryOptions } from "@tanstack/react-query"
import * as issue from "./functions"

export const issueListQuery = (input: {
   organizationId: string
}) =>
   queryOptions({
      queryKey: ["issue_list", input.organizationId],
      queryFn: () => issue.list(input),
   })

export const issueByIdQuery = (input: {
   organizationId: string
   issueId: string
}) =>
   queryOptions({
      queryKey: ["issue_by_id", input.issueId],
      queryFn: () => issue.byId(input),
   })
