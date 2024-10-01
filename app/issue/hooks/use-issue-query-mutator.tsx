import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import type { insertIssueParams, updateIssueParams } from "@/issue/schema"
import { useAuth } from "@/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"
import type { z } from "zod"

export function useIssueQueryMutator() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const deleteIssueFromQueryData = ({ issueId }: { issueId: string }) => {
      queryClient.setQueryData(
         issueListQuery({ organizationId }).queryKey,
         (oldData) =>
            produce(oldData, (draft) => {
               return draft?.filter((issue) => issue.id !== issueId)
            }),
      )

      queryClient.setQueryData(
         issueByIdQuery({ issueId, organizationId }).queryKey,
         () => null,
      )
   }

   const insertIssueToQueryData = ({
      input,
   }: { input: z.infer<typeof insertIssueParams> }) => {
      queryClient.setQueryData(
         issueListQuery({ organizationId }).queryKey,
         (oldData) => [
            ...(oldData ?? []),
            {
               ...input,
               id: crypto.randomUUID(),
               description: input.description ?? "",
               createdAt: Date.now(),
               updatedAt: Date.now(),
            },
         ],
      )
   }

   const updateIssueInQueryData = ({
      input,
   }: {
      input: z.infer<typeof updateIssueParams>
   }) => {
      queryClient.setQueryData(
         issueListQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData
            return produce(oldData, (draft) => {
               const issue = draft?.find((issue) => issue.id === input.id)
               if (!issue) return

               Object.assign(issue, {
                  ...(input.title &&
                     issue.title !== input.title && { title: input.title }),
                  ...(input.description && { description: input.description }),
                  ...(input.label && { label: input.label }),
                  ...(input.status && { status: input.status }),
               })
            })
         },
      )

      queryClient.setQueryData(
         issueByIdQuery({ issueId: input.id, organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return

            return {
               ...oldData,
               ...input,
            }
         },
      )
   }

   return {
      deleteIssueFromQueryData,
      insertIssueToQueryData,
      updateIssueInQueryData,
   }
}
