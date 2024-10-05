import { useCommentQueryMutator } from "@/comment/hooks/use-comment-query-mutator"
import { useCommentStore } from "@/comment/store"
import type { CommentEvent } from "@/comment/types"
import { env } from "@/env"
import { useAuth } from "@/user/hooks"
import usePartySocket from "partysocket/react"
import { useEffect } from "react"

export function useCommentSocket() {
   const { organizationId, user } = useAuth()
   const { insertCommentToQueryData } = useCommentQueryMutator()

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
      },
   })

   useEffect(() => {
      if (!socket) return

      useCommentStore.setState({ socket })
   }, [socket])

   return null
}
