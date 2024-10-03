import { env } from "@/env"
import { useIssueQueryMutator } from "@/issue/hooks/use-issue-query-mutator"
import { useIssueStore } from "@/issue/store"
import type { IssueEvent } from "@/issue/types"
import { useAuth } from "@/user/hooks"
import { useNavigate, useParams } from "@tanstack/react-router"
import usePartySocket from "partysocket/react"
import { useCallback, useEffect } from "react"

export function useIssueSocket() {
   const { organizationId, user } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()
   const {
      deleteIssueFromQueryData,
      insertIssueToQueryData,
      updateIssueInQueryData,
   } = useIssueQueryMutator()

   const notify = useCallback(
      ({
         title,
         body,
         issueId,
      }: { title: string; body: string; issueId: string }) => {
         if (!("Notification" in window))
            return console.log(
               "This browser does not support desktop notification",
            )
         const onClick = () =>
            navigate({
               to: "/$slug/issue/$issueId",
               params: { slug, issueId },
            })
         if (Notification.permission === "granted") {
            new Notification(title, { body, icon: "/logo.png" }).onclick =
               onClick
         } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
               if (permission === "granted") {
                  new Notification(title, { body, icon: "/logo.png" }).onclick =
                     onClick
               }
            })
         }
      },
      [navigate, slug],
   )

   const socket = usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "issue",
      room: organizationId,
      onMessage(event) {
         const message: IssueEvent = JSON.parse(event.data)
         if (message.senderId === user.id) return

         if (message.type === "insert") {
            notify({
               title: "New Issue",
               body: message.issue.title,
               issueId: message.issue.id,
            })
            return insertIssueToQueryData({ input: message.issue })
         }

         if (message.type === "update") {
            if (message.input.status === "done" && message.input.title) {
               notify({
                  title: "Issue resolved",
                  body: `Issue "${message.input.title}" has just been resolved.`,
                  issueId: message.issueId,
               })
            }
            return updateIssueInQueryData({ input: message.input })
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
