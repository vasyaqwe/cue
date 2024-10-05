import type * as commentFns from "@/comment/functions"
import { commentListQuery } from "@/comment/queries"
import { useAuth } from "@/user/hooks"
import { useQueryClient } from "@tanstack/react-query"

export function useCommentQueryMutator() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

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
   }
}
