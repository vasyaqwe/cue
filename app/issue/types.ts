import type { insertIssueParams } from "@/db/schema"
import type { z } from "zod"

export type IssueEvent =
   | {
        type: "insert"
        issue: z.infer<typeof insertIssueParams>
        senderId: string
     }
   | {
        type: "delete"
        issueId: string
        senderId: string
     }
