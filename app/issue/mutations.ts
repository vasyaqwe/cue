import { useAuth } from "@/auth/hooks"
import { env } from "@/env"
import * as issue from "@/issue/functions"
import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import type { insertIssueParams, updateIssueParams } from "@/issue/schema"
import type { IssueEvent } from "@/issue/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { produce } from "immer"
import usePartySocket from "partysocket/react"
import { toast } from "sonner"
import type { z } from "zod"

export function useDeleteIssue() {
   const queryClient = useQueryClient()
   const socket = useIssueSocket()
   const params = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()
   const { organizationId, user } = useAuth()
   const { deleteIssueFromQueryData } = useIssueQueryMutator()

   const isOnIssueIdPage = "issueId" in params && params.issueId

   const deleteFn = useServerFn(issue.deleteFn)
   const deleteIssue = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ issueId }) => {
         if (isOnIssueIdPage) {
            navigate({ to: "/$slug", params: { slug: params.slug } })
         }
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
      onError: (_err, data, context) => {
         queryClient.setQueryData(
            issueListQuery({ organizationId }).queryKey,
            context?.data,
         )
         toast.error("Failed to delete issue")

         if (isOnIssueIdPage)
            navigate({
               to: "/$slug/issue/$issueId",
               params: { slug: params.slug, issueId: data.issueId },
            })
      },
      onSettled: () => {
         queryClient.invalidateQueries(issueListQuery({ organizationId }))
      },
   })

   return {
      deleteIssue,
   }
}

export function useUpdateIssue() {
   const queryClient = useQueryClient()
   const socket = useIssueSocket()
   const params = useParams({ strict: false })
   const { organizationId, user } = useAuth()
   const { updateIssueInQueryData } = useIssueQueryMutator()

   const updateFn = useServerFn(issue.update)
   const updateIssue = useMutation({
      mutationFn: updateFn,
      onMutate: async (input) => {
         socket.send(
            JSON.stringify({
               type: "update",
               issueId: input.id,
               input,
               senderId: user.id,
            } satisfies IssueEvent),
         )

         await queryClient.cancelQueries(issueListQuery({ organizationId }))

         const data = queryClient.getQueryData(
            issueListQuery({ organizationId }).queryKey,
         )

         updateIssueInQueryData({ input })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            issueListQuery({ organizationId }).queryKey,
            context?.data,
         )
         toast.error("Failed to update issue")
      },
      onSettled: () => {
         queryClient.invalidateQueries(issueListQuery({ organizationId }))
         if ("issueId" in params && params.issueId)
            queryClient.invalidateQueries(
               issueByIdQuery({ issueId: params.issueId, organizationId }),
            )
      },
   })

   return {
      updateIssue,
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
         (oldData) =>
            produce(oldData, (draft) => {
               const issue = draft?.find((issue) => issue.id === input.id)
               if (!issue) return

               if (input.title) issue.title = input.title
               if (input.description) issue.description = input.description
               if (input.label) issue.label = input.label
               if (input.status) issue.status = input.status
            }),
      )
   }

   return {
      deleteIssueFromQueryData,
      insertIssueToQueryData,
      updateIssueInQueryData,
   }
}

export function useIssueSocket() {
   const { organizationId, user } = useAuth()
   const {
      deleteIssueFromQueryData,
      insertIssueToQueryData,
      updateIssueInQueryData,
   } = useIssueQueryMutator()

   return usePartySocket({
      host: env.VITE_PARTYKIT_URL,
      party: "issue",
      room: organizationId,
      onMessage(event: MessageEvent<string>) {
         const message: IssueEvent = JSON.parse(event.data)
         if (message.senderId === user.id) return

         if (message.type === "insert") {
            return insertIssueToQueryData({ input: message.issue })
         }

         if (message.type === "update") {
            return updateIssueInQueryData({ input: message.input })
         }

         if (message.type === "delete") {
            return deleteIssueFromQueryData({ issueId: message.issueId })
         }
      },
   })
}
