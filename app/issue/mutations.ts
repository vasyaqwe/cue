import { useAuth } from "@/auth/hooks"
import * as issue from "@/issue/functions"
import { issueListQuery } from "@/issue/queries"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { produce } from "immer"

export function useDeleteIssue() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const deleteIssueFromCache = ({ issueId }: { issueId: string }) => {
      queryClient.setQueryData(
         issueListQuery({ organizationId }).queryKey,
         (oldData) =>
            produce(oldData, (draft) => {
               return draft?.filter((issue) => issue.id !== issueId)
            }),
      )
   }

   const deleteFn = useServerFn(issue.deleteFn)
   const deleteIssue = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ issueId }) => {
         await queryClient.cancelQueries(issueListQuery({ organizationId }))
         const data = queryClient.getQueryData(
            issueListQuery({ organizationId }).queryKey,
         )
         deleteIssueFromCache({ issueId })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            issueListQuery({ organizationId }).queryKey,
            context?.data,
         )
      },
      onSettled: () => {
         queryClient.invalidateQueries(issueListQuery({ organizationId }))
      },
   })

   return {
      deleteIssue,
      deleteIssueFromCache,
   }
}
