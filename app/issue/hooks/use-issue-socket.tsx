import { env } from "@/env"
import { useIssueQueryMutator } from "@/issue/hooks/use-issue-query-mutator"
import type { IssueEvent } from "@/issue/types"
import { useAuth } from "@/user/hooks"
import { useNavigate, useParams } from "@tanstack/react-router"
import PartySocket from "partysocket"
import { useEffect, useRef } from "react"

let partySocketInstance: PartySocket | null = null

const getPartySocketInstance = ({ room }: { room: string }) => {
   if (!partySocketInstance) {
      partySocketInstance = new PartySocket({
         host: env.VITE_PARTYKIT_URL,
         party: "issue",
         room,
      })
   }
   return partySocketInstance
}

export function useIssueSocket({
   shouldListenToEvents = false,
}: { shouldListenToEvents?: boolean } = {}) {
   const { organizationId, user } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()
   const {
      deleteIssueFromQueryData,
      insertIssueToQueryData,
      updateIssueInQueryData,
   } = useIssueQueryMutator()
   const connectionRef = useRef<PartySocket | null>(null)

   const notify = ({
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
         new Notification(title, { body, icon: "/logo.png" }).onclick = onClick
      } else if (Notification.permission !== "denied") {
         Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
               new Notification(title, { body, icon: "/logo.png" }).onclick =
                  onClick
            }
         })
      }
   }

   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   useEffect(() => {
      const connection = getPartySocketInstance({
         room: organizationId,
      })

      connection.onmessage = (event: MessageEvent<string>) => {
         if (!shouldListenToEvents) return

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
                  body: `Issue “${message.input.title}” has just been resolved.`,
                  issueId: message.issueId,
               })
            }
            return updateIssueInQueryData({ input: message.input })
         }

         if (message.type === "delete") {
            return deleteIssueFromQueryData({ issueId: message.issueId })
         }
      }

      connectionRef.current = connection

      return () => {
         connectionRef.current = null
      }
   }, [organizationId])

   return {
      socket: connectionRef.current,
      sendEvent: (event: IssueEvent) => {
         if (!connectionRef.current) return
         connectionRef.current.send(JSON.stringify(event))
      },
   }
}
