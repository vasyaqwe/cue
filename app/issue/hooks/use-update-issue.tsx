import { useInsertNotification } from "@/inbox/hooks/use-insert-notification"
import * as issue from "@/issue/functions"
import { useIssueQueryMutator } from "@/issue/hooks/use-issue-query-mutator"
import { useIssueSocket } from "@/issue/hooks/use-issue-socket"
import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useUpdateIssue() {
   const queryClient = useQueryClient()
   const { sendEvent } = useIssueSocket()
   const params = useParams({ strict: false })
   const { organizationId, user } = useAuth()
   const { updateIssueInQueryData } = useIssueQueryMutator()
   const { insertNotification } = useInsertNotification()

   const issueIdParam = "issueId" in params ? params.issueId : null

   const updateFn = useServerFn(issue.update)
   const updateIssue = useMutation({
      mutationFn: updateFn,
      onMutate: async (input) => {
         sendEvent({
            type: "update",
            issueId: input.id,
            input,
            senderId: user.id,
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

         updateIssueInQueryData({ input })

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
      onSettled: (_, _error, issue) => {
         queryClient.invalidateQueries(issueListQuery({ organizationId }))
         if (issueIdParam)
            queryClient.invalidateQueries(
               issueByIdQuery({ issueId: issueIdParam, organizationId }),
            )

         if (issue.status && issue.status === "done") {
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
      },
   })

   return {
      updateIssue,
   }
}
