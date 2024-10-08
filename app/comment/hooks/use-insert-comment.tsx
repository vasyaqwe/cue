import * as comment from "@/comment/functions"
import { useCommentQueryMutator } from "@/comment/hooks/use-comment-query-mutator"
import { commentListQuery } from "@/comment/queries"
import { useCommentStore } from "@/comment/store"
import { issueByIdQuery } from "@/issue/queries"
import { useInsertNotification } from "@/notification/hooks/use-insert-notification"
import { useAuth } from "@/user/hooks"
import {
   useMutation,
   useQueryClient,
   useSuspenseQuery,
} from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import { P, match } from "ts-pattern"

export function useInsertComment({ onMutate }: { onMutate?: () => void } = {}) {
   const { issueId } = useParams({ strict: false })
   if (!issueId)
      throw new Error("useInsertComment must be used in an $issueId route")

   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()

   const issue = useSuspenseQuery(issueByIdQuery({ organizationId, issueId }))
   const sendEvent = useCommentStore().sendEvent
   const { insertNotification } = useInsertNotification()

   const insertFn = useServerFn(comment.insert)
   const { insertCommentToQueryData } = useCommentQueryMutator()

   const insertComment = useMutation({
      mutationFn: insertFn,
      onMutate: async (input) => {
         onMutate?.()
         await queryClient.cancelQueries(
            commentListQuery({ organizationId, issueId }),
         )

         const data = queryClient.getQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
         )

         insertCommentToQueryData({
            input: {
               id: crypto.randomUUID(),
               content: input.content ?? "",
               issueId,
               resolvedBy: null,
               author: {
                  id: user.id,
                  avatarUrl: user.avatarUrl,
                  name: user.name,
               },
               createdAt: Date.now(),
            },
         })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
            context?.data,
         )
         toast.error("Failed to submit comment")
      },
      onSettled: (comment, error) => {
         queryClient.invalidateQueries(
            commentListQuery({ organizationId, issueId }),
         )

         match({ error, comment, issue }).with(
            {
               error: null,
               comment: P.not(undefined),
               issue: { data: P.not(null) },
            },
            ({ comment, issue }) => {
               sendEvent({
                  type: "insert",
                  comment: {
                     id: comment.id,
                     content: comment.content ?? "",
                     createdAt: comment.createdAt,
                     issueId: comment.issueId,
                     resolvedBy: null,
                     author: {
                        id: user.id,
                        avatarUrl: user.avatarUrl,
                        name: user.name,
                     },
                  },
                  issueTitle: issue.data.title,
                  senderId: user.id,
               })

               insertNotification.mutate({
                  organizationId,
                  issueId: comment.issueId,
                  type: "new_issue_comment",
                  content: comment.content,
                  issue: {
                     title: issue.data.title,
                     status: issue.data.status,
                  },
                  commentId: comment.id,
               })
            },
         )
      },
   })

   return {
      insertComment,
   }
}
