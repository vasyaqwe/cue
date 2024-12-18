import { issueViews } from "@/issue/constants"
import type { IssueStatus, IssueView } from "@/issue/types"

export const isIssueView = (view: string): view is IssueView =>
   issueViews.includes(view as never)

export const isStatusActive = (status: IssueStatus) =>
   status === "in progress" || status === "todo"
