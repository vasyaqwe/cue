import { useDeleteComment } from "@/comment/hooks/use-delete-comment"
import { useInsertComment } from "@/comment/hooks/use-insert-comment"
import { useUpdateComment } from "@/comment/hooks/use-update-comment"
import { useCommentStore } from "@/comment/store"
import type { CommentEvent } from "@/comment/types"
import { env } from "@/env"
import { useAuth } from "@/user/hooks"
import usePartySocket from "partysocket/react"
import { useEffect } from "react"
import { match } from "ts-pattern"

export function useCommentSocket() {
   const { organizationId, user } = useAuth()

   const { deleteCommentFromQueryData } = useDeleteComment()
   const { updateCommentInQueryData } = useUpdateComment()
   const { insertCommentToQueryData } = useInsertComment()

   const socket = usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "comment",
      room: organizationId,
      onMessage(event) {
         return match(JSON.parse(event.data) as CommentEvent)
            .with({ senderId: user.id }, () => {})
            .with({ type: "insert" }, (msg) =>
               insertCommentToQueryData({ input: msg.comment }),
            )
            .with({ type: "update" }, (msg) =>
               updateCommentInQueryData({ input: msg.comment }),
            )
            .with({ type: "delete" }, (msg) =>
               deleteCommentFromQueryData({
                  commentId: msg.commentId,
                  issueId: msg.issueId,
               }),
            )
            .exhaustive()
      },
   })

   useEffect(() => {
      useCommentStore.setState({ socket })
   }, [socket])

   return null
}
