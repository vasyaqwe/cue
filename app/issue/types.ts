import type { updateIssueParams } from "@/issue/schema"
import type { z } from "zod"
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
   | {
        type: "update"
        issueId: string
        input: z.infer<typeof updateIssueParams>
        senderId: string
     }
