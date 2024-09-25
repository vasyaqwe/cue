import type * as issue from "./functions"

export type IssueEvent =
   | {
        type: "insert"
        issue: Awaited<ReturnType<typeof issue.list>>[number]
        senderId: string
     }
   | {
        type: "delete"
        issueId: string
        senderId: string
     }
