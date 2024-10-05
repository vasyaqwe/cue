import { useInsertNotification } from "@/inbox/hooks/use-insert-notification"
import { useNotificationQueryMutator } from "@/inbox/hooks/use-notification-query-mutator"
import { inboxListQuery } from "@/inbox/queries"
import { useInboxStore } from "@/inbox/store"
import * as issue from "@/issue/functions"
import { useIssueQueryMutator } from "@/issue/hooks/use-issue-query-mutator"
import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import { useIssueStore } from "@/issue/store"
import { useAuth } from "@/user/hooks"
import {
   useMutation,
   useQueryClient,
   useSuspenseQuery,
} from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useUpdateIssue() {
   const queryClient = useQueryClient()
   const sendIssueEvent = useIssueStore().sendEvent
   const sendNotificationEvent = useInboxStore().sendEvent
   const params = useParams({ strict: false })
   const { organizationId, user } = useAuth()
   const { updateIssueInQueryData } = useIssueQueryMutator()
   const { updateNotificationsInQueryData } = useNotificationQueryMutator()
   const { insertNotification } = useInsertNotification()
   const notificatons = useSuspenseQuery(inboxListQuery({ organizationId }))

   const issueIdParam = "issueId" in params ? params.issueId : null

   const updateFn = useServerFn(issue.update)
   const updateIssue = useMutation({
      mutationFn: updateFn,
      onMutate: async (input) => {
         const notificationsWithUpdatedIssue = notificatons.data.filter(
            (notification) => notification.issueId === input.id,
         )

         updateIssueInQueryData({
            input,
         })
         updateNotificationsInQueryData({
            input: {
               ids: notificationsWithUpdatedIssue.map((n) => n.id),
               issue: {
                  title: input.title,
                  status: input.status,
               },
            },
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
      onSettled: (_, error, issue) => {
         queryClient.invalidateQueries(issueListQuery({ organizationId }))
         if (issueIdParam)
            queryClient.invalidateQueries(
               issueByIdQuery({ issueId: issueIdParam, organizationId }),
            )

         if (error || !issue) return

         if (issue.status === "done") {
            insertNotification.mutate({
               organizationId,
               issueId: issue.id,
               type: "issue_resolved",
               content: `Marked as done by ${user.name}`,
               issue: {
                  title: issue.title,
                  status: issue.status,
               },
            })
         }

         sendNotificationEvent({
            type: "issue_update",
            senderId: user.id,
            issue: {
               id: issue.id,
               title: issue.title,
               status: issue.status,
            },
         })

         sendIssueEvent({
            type: "update",
            issueId: issue.id,
            input: issue,
            senderId: user.id,
         })
      },
   })

   return {
      updateIssue,
   }
}
