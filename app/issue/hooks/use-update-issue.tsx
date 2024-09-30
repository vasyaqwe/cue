import * as issue from "@/issue/functions"
import { useIssueQueryMutator } from "@/issue/hooks/use-issue-query-mutator"
import { useIssueSocket } from "@/issue/hooks/use-issue-socket"
import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import type { IssueEvent } from "@/issue/types"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useUpdateIssue() {
   const queryClient = useQueryClient()
   const { socket } = useIssueSocket()
   const params = useParams({ strict: false })
   const { organizationId, user } = useAuth()
   const { updateIssueInQueryData } = useIssueQueryMutator()

   const updateFn = useServerFn(issue.update)
   const updateIssue = useMutation({
      mutationFn: updateFn,
      onMutate: async (input) => {
         socket?.send(
            JSON.stringify({
               type: "update",
               issueId: input.id,
               input,
               senderId: user.id,
            } satisfies IssueEvent),
         )

         await queryClient.cancelQueries(issueListQuery({ organizationId }))

         const data = queryClient.getQueryData(
            issueListQuery({ organizationId }).queryKey,
         )

         updateIssueInQueryData({ input })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            issueListQuery({ organizationId }).queryKey,
            context?.data,
         )
         toast.error("Failed to update issue")
      },
      onSettled: () => {
         queryClient.invalidateQueries(issueListQuery({ organizationId }))
         if ("issueId" in params && params.issueId)
            queryClient.invalidateQueries(
               issueByIdQuery({ issueId: params.issueId, organizationId }),
            )
      },
   })

   return {
      updateIssue,
   }
}
