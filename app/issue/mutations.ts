import { useAuth } from "@/auth/hooks"
import { env } from "@/env"
import * as issue from "@/issue/functions"
import { issueListQuery } from "@/issue/queries"
import type { IssueEvent } from "@/issue/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { produce } from "immer"
import usePartySocket from "partysocket/react"

export function useDeleteIssue() {
   const queryClient = useQueryClient()
   const socket = useIssueSocket()
   const { organizationId, user } = useAuth()
   const { deleteIssueFromCache } = useIssueQueryMutator()

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
   }
}

function useIssueQueryMutator() {
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

   return { deleteIssueFromCache }
}

function useIssueSocket() {
   const { organizationId, user } = useAuth()
   const { deleteIssueFromCache } = useIssueQueryMutator()

   return usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "issue",
      room: organizationId,
      onMessage(event: MessageEvent<string>) {
         const message: IssueEvent = JSON.parse(event.data)
         if (message.senderId === user.id) return

         if (message.type === "delete") {
            return deleteIssueFromCache({ issueId: message.issueId })
         }
      },
   })
}
