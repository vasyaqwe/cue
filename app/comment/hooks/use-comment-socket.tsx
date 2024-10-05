import { useCommentQueryMutator } from "@/comment/hooks/use-comment-query-mutator"
import { useCommentStore } from "@/comment/store"
import type { CommentEvent } from "@/comment/types"
import { env } from "@/env"
import { useAuth } from "@/user/hooks"
import { useNavigate, useParams } from "@tanstack/react-router"
import usePartySocket from "partysocket/react"
import { useEffect } from "react"

export function useCommentSocket() {
   const { organizationId, user } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()
   const { insertCommentToQueryData, deleteCommentFromQueryData } =
      useCommentQueryMutator()

   const _notify = ({
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
            to: "/$slug/inbox/issue/$issueId",
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

   const socket = usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "comment",
      room: organizationId,
      onMessage(event) {
         const message: CommentEvent = JSON.parse(event.data)
         if (message.senderId === user.id) return
         if (message.type === "insert") {
            return insertCommentToQueryData({
               input: message.comment,
            })
         }
         if (message.type === "delete") {
            return deleteCommentFromQueryData({
               commentId: message.commentId,
               issueId: message.issueId,
            })
         }
      },
   })

   useEffect(() => {
      if (!socket) return

      useCommentStore.setState({ socket })
   }, [socket])

   return null
}
