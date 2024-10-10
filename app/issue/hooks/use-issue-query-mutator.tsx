import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import type { updateIssueParams } from "@/issue/schema"
import { useNotificationQueryMutator } from "@/notification/hooks/use-notification-query-mutator"
import { notificationListQuery } from "@/notification/queries"
import { useAuth } from "@/user/hooks"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { produce } from "immer"
import { P, match } from "ts-pattern"
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
      if (isOnIssueIdPage && params.issueId === issueId) {
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
      match(notificatons.data)
         .with([], () => {})
         .otherwise((data) =>
            match(
               data.filter((notification) => notification.issueId === issueId),
            )
               .with([], () => {})
               .otherwise((notificationsToDelete) =>
                  deleteNotificationsFromQueryData({
                     issueIds: notificationsToDelete.map(
                        (notification) => notification.issueId,
                     ),
                     notificationId: undefined,
                  }),
               ),
         )
   }

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

   const updateIssueInQueryData = ({
      input,
   }: {
      input: z.infer<typeof updateIssueParams>
   }) => {
      queryClient.setQueryData(
         issueListQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) =>
                  produce(data, (draft) =>
                     match(draft?.find((issue) => issue.id === input.id))
                        .with(undefined, () => {})
                        .otherwise((issue) => {
                           issue.title = input.title

                           match(input)
                              .with(
                                 { description: P.not(undefined) },
                                 (input) => {
                                    issue.description = input.description
                                 },
                              )
                              .with({ label: P.not(undefined) }, (input) => {
                                 issue.label = input.label
                              })
                              .with({ status: P.not(undefined) }, (input) => {
                                 issue.status = input.status
                              })
                        }),
                  ),
               ),
      )

      queryClient.setQueryData(
         issueByIdQuery({ issueId: input.id, organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(P.nullish, (data) => data)
               .otherwise((data) =>
                  produce(data, (draft) => {
                     draft.title = input.title

                     match(input)
                        .with({ description: P.not(undefined) }, (input) => {
                           draft.description = input.description
                        })
                        .with({ label: P.not(undefined) }, (input) => {
                           draft.label = input.label
                        })
                        .with({ status: P.not(undefined) }, (input) => {
                           draft.status = input.status
                        })
                  }),
               ),
      )
   }

   return {
      deleteIssueFromQueryData,
      insertIssueToQueryData,
      updateIssueInQueryData,
   }
}
