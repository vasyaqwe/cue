import { env } from "@/env"
import { useNotificationQueryMutator } from "@/notification/hooks/use-notification-query-mutator"
import { useUpdateNotification } from "@/notification/hooks/use-update-notification"
import { useNotificationStore } from "@/notification/store"
import type { NotificationEvent } from "@/notification/types"
import { useAuth } from "@/user/hooks"
import { useLocation, useNavigate, useParams } from "@tanstack/react-router"
import usePartySocket from "partysocket/react"
import { useEffect } from "react"
import { match } from "ts-pattern"

export function useNotificationSocket() {
   const { organizationId, user } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const { pathname } = useLocation()
   const navigate = useNavigate()
   const {
      insertNotificationToQueryData,
      updateIssuesInNotificationsQueryData,
   } = useNotificationQueryMutator()

   const { updateNotification } = useUpdateNotification()

   const notify = ({
      title,
      body,
      issueId,
   }: {
      title: string
      body: string
      issueId: string
   }) => {
      if (pathname.includes(issueId))
         return updateNotification.mutate({
            issueIds: [issueId],
            isRead: true,
            organizationId,
         })

      if (!("Notification" in window))
         return console.log(
            "This browser does not support desktop notification",
         )
      const onClick = () => {
         navigate({
            to: "/$slug/inbox/issue/$issueId",
            params: { slug, issueId },
         }).then(() => {
            useNotificationStore.setState({
               activeItemIssueId: issueId,
            })
            updateNotification.mutate({
               issueIds: [issueId],
               isRead: true,
               organizationId,
            })
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
         return match(JSON.parse(event.data) as NotificationEvent)
            .with({ senderId: user.id }, () => {})
            .with({ type: "insert" }, (msg) => {
               insertNotificationToQueryData({ input: msg.notification })

               match(msg.notification.type)
                  .with("new_issue", () =>
                     notify({
                        title: `${msg.notification.sender.name} reported an issue`,
                        body: msg.notification.issue.title,
                        issueId: msg.notification.issueId,
                     }),
                  )
                  .with("issue_mention", () =>
                     notify({
                        title: `${msg.notification.sender.name} mentioned you in an issue`,
                        body: msg.notification.issue.title,
                        issueId: msg.notification.issueId,
                     }),
                  )
                  .with("issue_resolved", () =>
                     notify({
                        title: "Issue resolved",
                        body: `${msg.notification.sender.name} resolved ${msg.notification.issue.title}`,
                        issueId: msg.notification.issueId,
                     }),
                  )
                  .with("new_issue_comment", () =>
                     notify({
                        title: `${msg.notification.sender.name} commented on ${msg.notification.issue.title}`,
                        body: msg.notification.content,
                        issueId: msg.notification.issueId,
                     }),
                  )
                  .exhaustive()
            })
            .with({ type: "issue_update" }, (msg) =>
               updateIssuesInNotificationsQueryData({
                  updatedIssue: msg.issue,
               }),
            )
            .exhaustive()
      },
   })

   useEffect(() => {
      useNotificationStore.setState({ socket })
   }, [socket])

   return null
}
