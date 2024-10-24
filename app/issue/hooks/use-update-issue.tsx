import { favoriteListQuery } from "@/favorite/queries"
import * as issue from "@/issue/functions"
import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import type { updateIssueParams } from "@/issue/schema"
import { useIssueStore } from "@/issue/store"
import { useDeleteNotifications } from "@/notification/hooks/use-delete-notifications"
import { useInsertNotification } from "@/notification/hooks/use-insert-notification"
import { useUpdateNotification } from "@/notification/hooks/use-update-notification"
import { notificationListQuery } from "@/notification/queries"
import { useNotificationStore } from "@/notification/store"
import { organizationTeammatesIdsQuery } from "@/organization/queries"
import { useEditorStore } from "@/ui/components/editor/store"
import { useAuth } from "@/user/hooks"
import {
   useMutation,
   useQuery,
   useQueryClient,
   useSuspenseQuery,
} from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { produce } from "immer"
import { toast } from "sonner"
import { P, match } from "ts-pattern"
import type { z } from "zod"

export function useUpdateIssue() {
   const queryClient = useQueryClient()
   const sendIssueEvent = useIssueStore().sendEvent
   const sendNotificationEvent = useNotificationStore().sendEvent
   const params = useParams({ strict: false })
   const { organizationId, user } = useAuth()
   const { updateNotificationsInQueryData } = useUpdateNotification()
   const { insertNotification } = useInsertNotification()
   const { deleteNotifications } = useDeleteNotifications()
   const notificatons = useSuspenseQuery(
      notificationListQuery({ organizationId }),
   )

   const mentionedUserIds = useEditorStore().getMentionedUserIds("issue")
   const unmentionedUserIds = useEditorStore().getUnmentionedUserIds("issue")
   const clearMentions = useEditorStore().clearMentions

   const issueIdParam = "issueId" in params ? params.issueId : null

   const teammatesIds = useQuery(
      organizationTeammatesIdsQuery({ organizationId }),
   )

   const updateIssueInQueryData = ({
      input,
   }: {
      input: z.infer<typeof updateIssueParams>
   }) => {
      queryClient.setQueryData(
         issueListQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) =>
                  produce(data, (draft) =>
                     match(draft?.find((issue) => issue.id === input.id))
                        .with(undefined, () => {})
                        .otherwise((issue) => {
                           issue.title = input.title

                           if (input.description) {
                              issue.description = input.description
                           }
                           if (input.label) {
                              issue.label = input.label
                           }
                           if (input.status) {
                              issue.status = input.status
                           }
                        }),
                  ),
               ),
      )

      queryClient.setQueryData(
         issueByIdQuery({ issueId: input.id, organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(P.nullish, (data) => data)
               .otherwise((data) =>
                  produce(data, (draft) => {
                     draft.title = input.title

                     if (input.description) {
                        draft.description = input.description
                     }
                     if (input.label) {
                        draft.label = input.label
                     }
                     if (input.status) {
                        draft.status = input.status
                     }
                  }),
               ),
      )

      queryClient.setQueryData(
         favoriteListQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) =>
                  produce(data, (draft) =>
                     match(
                        draft?.find(
                           (favorite) => favorite.entityId === input.id,
                        ),
                     )
                        .with(undefined, () => {})
                        .otherwise((favorite) => {
                           favorite.issue.title = input.title
                           if (input.status) {
                              favorite.issue.status = input.status
                           }
                        }),
                  ),
               ),
      )
   }

   const updateFn = useServerFn(issue.update)
   const updateIssue = useMutation({
      mutationFn: updateFn,
      onMutate: async (input) => {
         match(
            notificatons.data.filter(
               (notification) => notification.issueId === input.id,
            ),
         )
            .with([], () => {})
            .otherwise((notificationsWithUpdatedIssue) =>
               updateNotificationsInQueryData({
                  input: {
                     issueIds: notificationsWithUpdatedIssue.map(
                        (n) => n.issueId,
                     ),
                     issue: {
                        title: input.title,
                        status: input.status,
                     },
                  },
               }),
            )

         updateIssueInQueryData({
            input,
         })

         await queryClient.cancelQueries(issueListQuery({ organizationId }))

         if (issueIdParam) {
            await queryClient.cancelQueries(
               issueByIdQuery({ issueId: issueIdParam, organizationId }),
            )
         }

         // biome-ignore lint/suspicious/noExplicitAny: <explanation>
         let data: any

         data = queryClient.getQueryData(
            issueListQuery({ organizationId }).queryKey,
         )
         if (issueIdParam) {
            data = queryClient.getQueryData(
               issueByIdQuery({ issueId: issueIdParam, organizationId })
                  .queryKey,
            )
         }

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            issueListQuery({ organizationId }).queryKey,
            context?.data,
         )
         if (issueIdParam)
            queryClient.setQueryData(
               issueByIdQuery({ issueId: issueIdParam, organizationId })
                  .queryKey,
               context?.data,
            )
         toast.error("Failed to update issue")
      },
      onSettled: (updatedIssue, error, input) => {
         queryClient.invalidateQueries(issueListQuery({ organizationId }))
         if (issueIdParam)
            queryClient.invalidateQueries(
               issueByIdQuery({ issueId: issueIdParam, organizationId }),
            )

         match({ error, updatedIssue }).with(
            { error: null, updatedIssue: P.not(undefined) },
            ({ updatedIssue }) => {
               match(mentionedUserIds)
                  .with([], () => {})
                  .otherwise((receiverIds) =>
                     insertNotification.mutate({
                        organizationId,
                        issueId: input.id,
                        type: "issue_mention",
                        content: `${user.name} mentioned you in issue`,
                        issue: {
                           title: input.title,
                           status: updatedIssue.status,
                        },
                        receiverIds,
                     }),
                  )

               match(unmentionedUserIds)
                  .with([], () => {})
                  .otherwise((receiverIds) =>
                     deleteNotifications.mutate({
                        issueIds: [input.id],
                        receiverIds,
                     }),
                  )

               clearMentions("issue")

               match(input).with({ status: "done" }, (issue) =>
                  match(teammatesIds.data ?? [])
                     .with([], () => {})
                     .otherwise((receiverIds) =>
                        insertNotification.mutate({
                           organizationId,
                           issueId: issue.id,
                           type: "issue_resolved",
                           content: `Marked as done by ${user.name}`,
                           issue: {
                              title: issue.title,
                              status: issue.status,
                           },
                           receiverIds,
                        }),
                     ),
               )

               sendNotificationEvent({
                  type: "issue_update",
                  senderId: user.id,
                  issue: {
                     id: input.id,
                     title: input.title,
                     status: updatedIssue.status,
                  },
               })

               sendIssueEvent({
                  type: "update",
                  issueId: input.id,
                  issue: {
                     ...input,
                     status: updatedIssue.status,
                     organizationId,
                  },
                  senderId: user.id,
               })
            },
         )
      },
   })

   return {
      updateIssue,
      updateIssueInQueryData,
   }
}
