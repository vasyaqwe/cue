import * as comment from "@/comment/functions"
import { commentListQuery } from "@/comment/queries"
import { useCommentStore } from "@/comment/store"
import type { InsertCommentEventInput } from "@/comment/types"
import type { IssueStatus } from "@/issue/schema"
import { useInsertNotification } from "@/notification/hooks/use-insert-notification"
import { organizationTeammatesIdsQuery } from "@/organization/queries"
import { useEditorStore } from "@/ui/components/editor/store"
import { useAuth } from "@/user/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import { P, match } from "ts-pattern"

export function useInsertComment({
   onMutate,
   issue,
}: {
   onMutate?: () => void
   issue?: {
      title: string
      status: IssueStatus
   }
} = {}) {
   const { issueId } = useParams({ strict: false })

   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()

   const sendEvent = useCommentStore().sendEvent
   const { insertNotification } = useInsertNotification()

   const insertFn = useServerFn(comment.insert)

   const teammatesIds = useQuery(
      organizationTeammatesIdsQuery({ organizationId }),
   )

   const mentionedUserIds =
      useEditorStore().getPendingMentionedUserIds("comment")
   const setPendingMentions = useEditorStore().setPendingMentions
   const clearMentions = useEditorStore().clearMentions

   const insertCommentToQueryData = ({
      input,
   }: { input: InsertCommentEventInput }) => {
      queryClient.setQueryData(
         commentListQuery({ organizationId, issueId: input.issueId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) => [...data, input]),
      )
   }

   const insertComment = useMutation({
      mutationFn: insertFn,
      onMutate: async (input) => {
         if (!issueId)
            throw new Error(
               "insertComment mutation must be used in an $issueId route",
            )

         onMutate?.()

         setPendingMentions("comment")

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
         if (!issueId)
            throw new Error(
               "insertComment mutation must be used in an $issueId route",
            )

         queryClient.setQueryData(
            commentListQuery({ organizationId, issueId }).queryKey,
            context?.data,
         )
         toast.error("Failed to submit comment")
      },
      onSettled: (comment, error) => {
         if (!issueId)
            throw new Error(
               "insertComment mutation must be used in an $issueId route",
            )

         queryClient.invalidateQueries(
            commentListQuery({ organizationId, issueId }),
         )

         match({ error, comment, issue }).with(
            {
               error: null,
               comment: P.not(undefined),
               issue: P.not(undefined),
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
                  issueTitle: issue.title,
                  senderId: user.id,
               })

               match(
                  teammatesIds.data?.filter(
                     (userId) => !mentionedUserIds.includes(userId),
                  ) ?? [],
               )
                  .with([], () => {})
                  .otherwise((receiverIds) =>
                     insertNotification.mutate({
                        organizationId,
                        issueId: comment.issueId,
                        type: "new_issue_comment",
                        content: comment.content,
                        issue: {
                           title: issue.title,
                           status: issue.status,
                        },
                        commentId: comment.id,
                        receiverIds,
                     }),
                  )

               match(mentionedUserIds)
                  .with([], () => {})
                  .otherwise(() =>
                     insertNotification.mutate({
                        organizationId,
                        issueId: comment.issueId,
                        type: "issue_comment_mention",
                        content: `${user.name} mentioned you in a comment`,
                        commentContent: comment.content,
                        issue: {
                           title: issue.title,
                           status: issue.status,
                        },
                        commentId: comment.id,
                        receiverIds: mentionedUserIds,
                     }),
                  )
            },
         )

         clearMentions("comment")
      },
   })

   return {
      insertComment,
      insertCommentToQueryData,
   }
}
