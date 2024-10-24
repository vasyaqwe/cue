import { issueListQuery } from "@/issue/queries"
import type { InsertIssueEventInput } from "@/issue/types"
import { useAuth } from "@/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { match } from "ts-pattern"

export function useInsertIssue() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const insertIssueToQueryData = ({
      input,
   }: {
      input: InsertIssueEventInput
   }) => {
      queryClient.setQueryData(
         issueListQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) => [
                  {
                     ...input,
                     id: input.id ?? crypto.randomUUID(),
                     isFavorited: false,
                     createdAt: Date.now(),
                     updatedAt: Date.now(),
                  },
                  ...data,
               ]),
      )
   }

   return {
      insertIssueToQueryData,
   }
}
