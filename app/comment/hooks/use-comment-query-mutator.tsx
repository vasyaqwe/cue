import type * as commentFns from "@/comment/functions"
import { commentListQuery } from "@/comment/queries"
import { useAuth } from "@/user/hooks"
import { useQueryClient } from "@tanstack/react-query"

export function useCommentQueryMutator() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const deleteCommentFromQueryData = ({
      commentId,
      issueId,
   }: { commentId: string; issueId: string }) => {
      queryClient.setQueryData(
         commentListQuery({ organizationId, issueId }).queryKey,
         (oldData) => oldData?.filter((comment) => comment.id !== commentId),
      )
   }

   const insertCommentToQueryData = ({
      input,
   }: { input: Awaited<ReturnType<typeof commentFns.list>>[number] }) => {
      queryClient.setQueryData(
         commentListQuery({ organizationId, issueId: input.issueId }).queryKey,
         (oldData) => [...(oldData ?? []), input],
      )
   }

   return {
      insertCommentToQueryData,
      deleteCommentFromQueryData,
   }
}
