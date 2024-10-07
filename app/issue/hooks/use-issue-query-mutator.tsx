import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import type { updateIssueParams } from "@/issue/schema"
import { useNotificationQueryMutator } from "@/notification/hooks/use-notification-query-mutator"
import { notificationListQuery } from "@/notification/queries"
import { useAuth } from "@/user/hooks"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { produce } from "immer"
import type { z } from "zod"
import type * as notificationFns from "../functions"

export function useIssueQueryMutator() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()
   const params = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()
   const notificatons = useSuspenseQuery(
      notificationListQuery({ organizationId }),
   )
   const { deleteNotificationsFromQueryData } = useNotificationQueryMutator()

   const isOnIssueIdPage = "issueId" in params && params.issueId

   const deleteIssueFromQueryData = ({ issueId }: { issueId: string }) => {
      if (isOnIssueIdPage) {
         navigate({ to: "/$slug", params: { slug: params.slug } })
      }

      queryClient.setQueryData(
         issueListQuery({ organizationId }).queryKey,
         (oldData) => oldData?.filter((issue) => issue.id !== issueId),
      )

      queryClient.setQueryData(
         issueByIdQuery({ issueId, organizationId }).queryKey,
         () => null,
      )

      // delete notifications that have issueId === deleted issue id (due on onCascade delete)
      if (notificatons.data.length === 0) return

      const notificationsToDelete = notificatons.data.filter(
         (notification) => notification.issueId === issueId,
      )
      if (notificationsToDelete?.length === 0) return

      deleteNotificationsFromQueryData({
         notificationIds: notificationsToDelete.map(
            (notification) => notification.id,
         ),
      })
   }

   const insertIssueToQueryData = ({
      input,
   }: {
      input: Awaited<ReturnType<typeof notificationFns.list>>[number]
   }) => {
      queryClient.setQueryData(
         issueListQuery({ organizationId }).queryKey,
         (oldData) => {
            if (!oldData) return oldData

            return [
               {
                  ...input,
                  id: input.id ?? crypto.randomUUID(),
                  description: input.description ?? "",
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
               },
               ...oldData,
            ]
         },
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
