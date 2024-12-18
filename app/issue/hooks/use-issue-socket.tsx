import { env } from "@/env"
import { useDeleteIssue } from "@/issue/hooks/use-delete-issue"
import { useInsertIssue } from "@/issue/hooks/use-insert-issue"
import { useUpdateIssue } from "@/issue/hooks/use-update-issue"
import { issueListQuery } from "@/issue/queries"
import { useIssueStore } from "@/issue/store"
import type { IssueEvent } from "@/issue/types"
import { useAuth } from "@/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import usePartySocket from "partysocket/react"
import { useEffect } from "react"
import { match } from "ts-pattern"

export function useIssueSocket() {
   const queryClient = useQueryClient()
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
            .with({ type: "update" }, (msg) => {
               updateIssueInQueryData({ input: msg.issue })

               const status = msg.issue.status
               if (!status) return

               queryClient.invalidateQueries(
                  issueListQuery({ organizationId, view: "active" }),
               )
               queryClient.invalidateQueries(
                  issueListQuery({ organizationId, view: "backlog" }),
               )
            })
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
