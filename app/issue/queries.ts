import type { byIdIssueParams, listIssueParams } from "@/db/schema"
import { queryOptions } from "@tanstack/react-query"
import type { z } from "zod"
import * as issue from "./functions"

export const issueListQuery = (input: z.infer<typeof listIssueParams>) =>
   queryOptions({
      queryKey: ["issue_list", input.organizationId],
      queryFn: () => issue.list(input),
   })

export const issueByIdQuery = (input: z.infer<typeof byIdIssueParams>) =>
   queryOptions({
      queryKey: ["issue_by_id", input.organizationId, input.issueId],
      queryFn: () => issue.byId(input),
   })
