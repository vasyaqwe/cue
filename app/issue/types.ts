import type { issueLabels, issueStatuses, issueViews } from "@/issue/constants"
import type { updateIssueParams } from "@/issue/schema"
import type { z } from "zod"
import type * as issue from "./functions"

export type InsertIssueEventInput = Omit<
   Awaited<ReturnType<typeof issue.list>>[number],
   "isFavorited"
>

export type IssueEvent =
   | {
        type: "insert"
        issue: InsertIssueEventInput
        senderId: string
     }
   | {
        type: "delete"
        issueId: string
        senderId: string
     }
   | {
        type: "update"
        issueId: string
        issue: z.infer<typeof updateIssueParams>
        senderId: string
     }

export type IssueView = (typeof issueViews)[number]
export type IssueStatus = (typeof issueStatuses)[number]
export type IssueLabel = (typeof issueLabels)[number]
