import { env } from "@/env"
import { useDeleteIssue } from "@/issue/hooks/use-delete-issue"
import { useInsertIssue } from "@/issue/hooks/use-insert-issue"
import { useUpdateIssue } from "@/issue/hooks/use-update-issue"
import { useIssueStore } from "@/issue/store"
import type { IssueEvent } from "@/issue/types"
import { useAuth } from "@/user/hooks"
import usePartySocket from "partysocket/react"
import { useEffect } from "react"
import { match } from "ts-pattern"

export function useIssueSocket() {
   const { organizationId, user } = useAuth()

   const { insertIssueToQueryData } = useInsertIssue()
   const { updateIssueInQueryData } = useUpdateIssue()
   const { deleteIssueFromQueryData } = useDeleteIssue()

   const socket = usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "issue",
      room: organizationId,
      onMessage(event) {
         return match(JSON.parse(event.data) as IssueEvent)
            .with({ senderId: user.id }, () => {})
            .with({ type: "insert" }, (msg) =>
               insertIssueToQueryData({ input: msg.issue }),
            )
            .with({ type: "update" }, (msg) =>
               updateIssueInQueryData({ input: msg.issue }),
            )
            .with({ type: "delete" }, (msg) =>
               deleteIssueFromQueryData({ issueId: msg.issueId }),
            )
            .exhaustive()
      },
   })

   useEffect(() => {
      useIssueStore.setState({ socket })
   }, [socket])

   return null
}
