import { issueListQuery } from "@/issue/queries"
import { useAuth } from "@/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { match } from "ts-pattern"
import type * as notificationFns from "../functions"

export function useInsertIssue() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const insertIssueToQueryData = ({
      input,
   }: {
      input: Awaited<ReturnType<typeof notificationFns.list>>[number]
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
                     description: input.description ?? "",
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
