import { env } from "@/env"
import { useNotificationQueryMutator } from "@/notification/hooks/use-notification-query-mutator"
import { useNotificationStore } from "@/notification/store"
import type { NotificationEvent } from "@/notification/types"
import { useAuth } from "@/user/hooks"
import { useNavigate, useParams } from "@tanstack/react-router"
import usePartySocket from "partysocket/react"
import { useEffect } from "react"

export function useNotificationSocket() {
   const { organizationId, user } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()
   const {
      insertNotificationToQueryData,
      updateIssuesInNotificationsQueryData,
   } = useNotificationQueryMutator()

   const notify = ({
      title,
      body,
      issueId,
      notificationId,
   }: {
      title: string
      body: string
      issueId: string
      notificationId: string
   }) => {
      if (!("Notification" in window))
         return console.log(
            "This browser does not support desktop notification",
         )
      const onClick = () => {
         navigate({
            to: "/$slug/inbox/issue/$issueId",
            params: { slug, issueId },
         })
         useNotificationStore.setState({
            activeItemId: notificationId,
         })
      }
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

   const socket = usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "inbox",
      room: organizationId,
      onMessage(event) {
         const message: NotificationEvent = JSON.parse(event.data)
         if (message.senderId === user.id) return
         if (message.type === "insert") {
            insertNotificationToQueryData({
               input: message.notification,
            })

            if (message.notification.type === "new_issue")
               return notify({
                  title: `${message.notification.sender.name} reported an issue`,
                  body: message.notification.issue.title,
                  issueId: message.notification.issueId,
                  notificationId: message.notification.id,
               })

            if (message.notification.type === "issue_resolved")
               return notify({
                  title: "Issue resolved",
                  body: `${message.notification.sender.name} resolved ${message.notification.issue.title}`,
                  issueId: message.notification.issueId,
                  notificationId: message.notification.id,
               })

            if (message.notification.type === "new_issue_comment") {
               return notify({
                  title: `${message.notification.sender.name} commented on ${message.notification.issue.title}`,
                  body: message.notification.content,
                  issueId: message.notification.issueId,
                  notificationId: message.notification.id,
               })
            }
         }
         if (message.type === "issue_update") {
            return updateIssuesInNotificationsQueryData({
               updatedIssue: message.issue,
            })
         }
      },
   })

   useEffect(() => {
      if (!socket) return

      useNotificationStore.setState({ socket })
   }, [socket])

   return null
}
