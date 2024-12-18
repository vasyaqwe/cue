import { issueViews } from "@/issue/constants"
import { issueListQuery } from "@/issue/queries"
import type { InsertIssueEventInput } from "@/issue/types"
import { isStatusActive } from "@/issue/utils"
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
      for (const view of issueViews) {
         queryClient.setQueryData(
            issueListQuery({ organizationId, view }).queryKey,
            (oldData) =>
               match(oldData)
                  .with(undefined, (data) => data)
                  .otherwise((data) => {
                     const shouldInsert = match(view)
                        .with("active", () => isStatusActive(input.status))
                        .with("backlog", () => input.status === "backlog")
                        .with("all", () => true)
                        .otherwise(() => false)

                     if (!shouldInsert) return data

                     return [
                        {
                           ...input,
                           isFavorited: false,
                        },
                        ...data,
                     ]
                  }),
         )
      }
   }

   return {
      insertIssueToQueryData,
   }
}
