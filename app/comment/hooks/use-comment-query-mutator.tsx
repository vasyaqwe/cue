import type * as commentFns from "@/comment/functions"
import { commentListQuery } from "@/comment/queries"
import { useAuth } from "@/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"

export function useCommentQueryMutator() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()
   const { issueId } = useParams({ from: "/$slug/_layout/issue/$issueId" })

   const insertCommentToQueryData = ({
      input,
   }: { input: Awaited<ReturnType<typeof commentFns.list>>[number] }) => {
      queryClient.setQueryData(
         commentListQuery({ organizationId, issueId }).queryKey,
         (oldData) => [input, ...(oldData ?? [])],
      )
   }

   return {
      insertCommentToQueryData,
   }
}
