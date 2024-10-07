import { env } from "@/env"
import { useIssueQueryMutator } from "@/issue/hooks/use-issue-query-mutator"
import { useIssueStore } from "@/issue/store"
import type { IssueEvent } from "@/issue/types"
import { useAuth } from "@/user/hooks"
import usePartySocket from "partysocket/react"
import { useEffect } from "react"

export function useIssueSocket() {
   const { organizationId, user } = useAuth()

   const {
      deleteIssueFromQueryData,
      insertIssueToQueryData,
      updateIssueInQueryData,
   } = useIssueQueryMutator()

   const socket = usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "issue",
      room: organizationId,
      onMessage(event) {
         const message: IssueEvent = JSON.parse(event.data)
         if (message.senderId === user.id) return

         if (message.type === "insert") {
            return insertIssueToQueryData({ input: message.issue })
         }

         if (message.type === "update") {
            return updateIssueInQueryData({ input: message.issue })
         }
         if (message.type === "delete") {
            return deleteIssueFromQueryData({ issueId: message.issueId })
         }
      },
   })

   useEffect(() => {
      if (!socket) return

      useIssueStore.setState({ socket })
   }, [socket])

   return null
}
