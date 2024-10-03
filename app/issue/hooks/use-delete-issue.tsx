import { inboxListQuery } from "@/inbox/queries"
import * as issue from "@/issue/functions"
import { useIssueQueryMutator } from "@/issue/hooks/use-issue-query-mutator"
import { useIssueSocket } from "@/issue/hooks/use-issue-socket"
import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useDeleteIssue() {
   const queryClient = useQueryClient()
   const { sendEvent } = useIssueSocket()
   const params = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()
   const { organizationId, user } = useAuth()
   const { deleteIssueFromQueryData } = useIssueQueryMutator()

   const isOnIssueIdPage = "issueId" in params && params.issueId

   const deleteFn = useServerFn(issue.deleteFn)
   const deleteIssue = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ issueId }) => {
         if (isOnIssueIdPage) {
            navigate({ to: "/$slug", params: { slug: params.slug } })
         }
         sendEvent({
            type: "delete",
            issueId,
            senderId: user.id,
         })

         await queryClient.cancelQueries(issueListQuery({ organizationId }))

         const data = queryClient.getQueryData(
            issueListQuery({ organizationId }).queryKey,
         )

         deleteIssueFromQueryData({ issueId })

         return { data }
      },
      onError: (_err, data, context) => {
         queryClient.setQueryData(
            issueListQuery({ organizationId }).queryKey,
            context?.data,
         )
         toast.error("Failed to delete issue")

         if (isOnIssueIdPage)
            navigate({
               to: "/$slug/issue/$issueId",
               params: { slug: params.slug, issueId: data.issueId },
            })
      },
      onSettled: (_, _error, data) => {
         queryClient.invalidateQueries(issueListQuery({ organizationId }))
         queryClient.invalidateQueries(
            issueByIdQuery({ issueId: data.issueId, organizationId }),
         )
         queryClient.invalidateQueries(inboxListQuery({ organizationId }))
      },
   })

   return {
      deleteIssue,
   }
}
