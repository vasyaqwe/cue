import * as favorite from "@/favorite/functions"
import { favoriteListQuery } from "@/favorite/queries"
import { issueByIdQuery } from "@/issue/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import { P, match } from "ts-pattern"

export function useDeleteFavorite() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()
   const { issueId } = useParams({ strict: false })

   const deleteFavoriteFromQueryData = ({ entityId }: { entityId: string }) => {
      queryClient.setQueryData(
         favoriteListQuery({ organizationId }).queryKey,
         (oldData) =>
            oldData?.filter((favorite) => favorite.entityId !== entityId),
      )

      match(issueId).with(P.not(undefined), () =>
         queryClient.setQueryData(
            issueByIdQuery({ issueId: entityId, organizationId }).queryKey,
            (oldData) =>
               match(oldData)
                  .with(P.nullish, (data) => data)
                  .otherwise((data) => ({ ...data, isFavorited: false })),
         ),
      )
   }

   const deleteFn = useServerFn(favorite.deleteFn)
   const deleteFavorite = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ entityId, organizationId }) => {
         await queryClient.cancelQueries(favoriteListQuery({ organizationId }))

         const data = queryClient.getQueryData(
            favoriteListQuery({ organizationId }).queryKey,
         )

         deleteFavoriteFromQueryData({ entityId })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            favoriteListQuery({ organizationId }).queryKey,
            context?.data,
         )
         toast.error("Failed to delete favorite")
      },
      onSettled: () => {
         queryClient.invalidateQueries(favoriteListQuery({ organizationId }))
      },
   })

   return {
      deleteFavorite,
      deleteFavoriteFromQueryData,
   }
}
