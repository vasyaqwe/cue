import { env } from "@/env"
import { useIssueQueryMutator } from "@/issue/hooks/use-issue-query-mutator"
import { useIssueStore } from "@/issue/store"
import type { IssueEvent } from "@/issue/types"
import { useAuth } from "@/user/hooks"
import usePartySocket from "partysocket/react"
import { useEffect } from "react"
import { match } from "ts-pattern"

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

         return match(message)
            .when(
               (msg) => msg.senderId === user.id,
               () => undefined,
            )
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
