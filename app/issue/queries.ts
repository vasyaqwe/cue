import type { listIssuesParams } from "@/db/schema"
import { queryOptions } from "@tanstack/react-query"
import type { z } from "zod"
import * as issue from "./functions"

export const issueListQuery = (input: z.infer<typeof listIssuesParams>) =>
   queryOptions({
      queryKey: ["issue_list", input.organizationId],
      queryFn: () => issue.list(input),
   })
