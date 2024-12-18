import { favoriteListQuery } from "@/favorite/queries"
import { issueViews } from "@/issue/constants"
import * as issue from "@/issue/functions"
import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import { useIssueStore } from "@/issue/store"
import { useDeleteNotifications } from "@/notification/hooks/use-delete-notifications"
import { notificationListQuery } from "@/notification/queries"
import { useAuth } from "@/user/hooks"
import {
   useMutation,
   useQueryClient,
   useSuspenseQuery,
} from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import { match } from "ts-pattern"

export function useDeleteIssue() {
   const queryClient = useQueryClient()
   const { organizationId, user } = useAuth()
   const sendEvent = useIssueStore().sendEvent
   const params = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()

   const { deleteNotificationsFromQueryData } = useDeleteNotifications()
   const notificatons = useSuspenseQuery(
      notificationListQuery({ organizationId }),
   )

   const isOnIssueIdPage = "issueId" in params && params.issueId

   const deleteIssueFromQueryData = ({ issueId }: { issueId: string }) => {
      if (isOnIssueIdPage && params.issueId === issueId) {
         navigate({ to: "/$slug", params: { slug: params.slug } })
      }

      queryClient.setQueryData(
         favoriteListQuery({ organizationId }).queryKey,
         (oldData) =>
            oldData?.filter((favorite) => favorite.entityId !== issueId),
      )

      for (const view of issueViews) {
         queryClient.setQueryData(
            issueListQuery({ organizationId, view }).queryKey,
            (oldData) => oldData?.filter((issue) => issue.id !== issueId),
         )
      }

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

   const deleteFn = useServerFn(issue.deleteFn)
   const deleteIssue = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ data: { issueId } }) => {
         await queryClient.cancelQueries(issueListQuery({ organizationId }))

         const data = queryClient.getQueryData(
            issueListQuery({ organizationId }).queryKey,
         )

         deleteIssueFromQueryData({ issueId })

         return { data }
      },
      onError: (_err, { data }, context) => {
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
      onSettled: (_, error, { data }) => {
         queryClient.invalidateQueries(issueListQuery({ organizationId }))
         queryClient.invalidateQueries(
            issueByIdQuery({ issueId: data.issueId, organizationId }),
         )
         queryClient.invalidateQueries(
            notificationListQuery({ organizationId }),
         )

         match(error).with(null, () =>
            sendEvent({
               type: "delete",
               issueId: data.issueId,
               senderId: user.id,
            }),
         )
      },
   })

   return {
      deleteIssue,
      deleteIssueFromQueryData,
   }
}
