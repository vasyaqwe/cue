import type { IssueView } from "@/issue/types"
import { queryOptions } from "@tanstack/react-query"
import * as issue from "./functions"

export const issueListQuery = (input: {
   organizationId: string
   view?: IssueView | undefined
}) =>
   queryOptions({
      queryKey: ["issue_list", input.organizationId, input.view],
      queryFn: () => issue.list({ data: input }),
   })

export const issueByIdQuery = (input: {
   organizationId: string
   issueId: string
}) =>
   queryOptions({
      queryKey: ["issue_by_id", input.issueId],
      queryFn: () => issue.byId({ data: input }),
   })
