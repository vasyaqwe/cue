import { useAuth } from "@/auth/hooks"
import type { insertIssueParams } from "@/db/schema"
import { env } from "@/env"
import * as issue from "@/issue/functions"
import { issueListQuery } from "@/issue/queries"
import type { IssueEvent } from "@/issue/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { produce } from "immer"
import usePartySocket from "partysocket/react"
import type { z } from "zod"

export function useDeleteIssue() {
   const queryClient = useQueryClient()
   const socket = useIssueSocket()
   const { organizationId, user } = useAuth()
   const { deleteIssueFromQueryData } = useIssueQueryMutator()

   const deleteFn = useServerFn(issue.deleteFn)
   const deleteIssue = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ issueId }) => {
         socket.send(
            JSON.stringify({
               type: "delete",
               issueId,
               senderId: user.id,
            } satisfies IssueEvent),
         )

         await queryClient.cancelQueries(issueListQuery({ organizationId }))

         const data = queryClient.getQueryData(
            issueListQuery({ organizationId }).queryKey,
         )

         deleteIssueFromQueryData({ issueId })

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
   }
}

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
   }

   const insertIssueToQueryData = ({
      issue,
   }: { issue: z.infer<typeof insertIssueParams> }) => {
      queryClient.setQueryData(
         issueListQuery({ organizationId }).queryKey,
         (oldData) => [
            ...(oldData ?? []),
            {
               ...issue,
               id: crypto.randomUUID(),
               description: issue.description ?? "",
               createdAt: Date.now(),
               updatedAt: Date.now(),
            },
         ],
      )
   }

   return { deleteIssueFromQueryData, insertIssueToQueryData }
}

export function useIssueSocket() {
   const { organizationId, user } = useAuth()
   const { deleteIssueFromQueryData, insertIssueToQueryData } =
      useIssueQueryMutator()

   return usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "issue",
      room: organizationId,
      onMessage(event: MessageEvent<string>) {
         const message: IssueEvent = JSON.parse(event.data)
         if (message.senderId === user.id) return

         if (message.type === "insert") {
            return insertIssueToQueryData({ issue: message.issue })
         }

         if (message.type === "delete") {
            return deleteIssueFromQueryData({ issueId: message.issueId })
         }
      },
   })
}
