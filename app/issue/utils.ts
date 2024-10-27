import { issueViews } from "@/issue/constants"
import type { IssueView } from "@/issue/types"

export const isIssueView = (view: string): view is IssueView =>
   issueViews.includes(view as never)
