import { env } from "@/env"
import { useIssueQueryMutator } from "@/issue/hooks/use-issue-query-mutator"
import type { IssueEvent } from "@/issue/types"
import { useAuth } from "@/user/hooks"
import { useNavigate, useParams } from "@tanstack/react-router"
import PartySocket from "partysocket"
import { useCallback, useEffect, useState } from "react"

let issueSocketInstance: PartySocket | null = null
let currentRoom: string | null = null

const getSocketInstance = ({ room }: { room: string }) => {
   if (issueSocketInstance && currentRoom === room) {
      return issueSocketInstance
   }

   if (issueSocketInstance) {
      issueSocketInstance.close()
   }

   issueSocketInstance = new PartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "issue",
      room,
   })
   currentRoom = room

   return issueSocketInstance
}

export function useIssueSocket() {
   const { organizationId, user } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()
   const [isReady, setIsReady] = useState(false)
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

   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   useEffect(() => {
      const connection = getSocketInstance({
         room: organizationId,
      })

      const message = (event: MessageEvent<string>) => {
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
      }

      const open = () => setIsReady(true)
      const close = () => setIsReady(false)

      connection.addEventListener("message", message)
      connection.addEventListener("open", open)
      connection.addEventListener("close", close)

      // Set initial state if connection is already open
      setIsReady(connection.readyState === WebSocket.OPEN)

      return () => {
         connection.removeEventListener("message", message)
         connection.removeEventListener("open", open)
         connection.removeEventListener("close", close)
      }
   }, [organizationId, user.id, notify])

   const sendEvent = useCallback(
      (event: IssueEvent) => {
         const connection = issueSocketInstance
         if (!connection || !isReady) {
            return console.warn("Issue socket not ready, cannot send event")
         }
         connection.send(JSON.stringify(event))
      },
      [isReady],
   )

   return {
      sendEvent,
   }
}
