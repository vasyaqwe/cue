import * as favorite from "@/favorite/functions"
import { favoriteListQuery } from "@/favorite/queries"
import type { FavoriteEntityType } from "@/favorite/schema"
import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { produce } from "immer"
import { toast } from "sonner"
import { P, match } from "ts-pattern"

export function useDeleteFavorite() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const deleteFavoriteFromQueryData = ({
      entityId,
      entityType,
   }: { entityId: string; entityType: FavoriteEntityType }) => {
      queryClient.setQueryData(
         favoriteListQuery({ organizationId }).queryKey,
         (oldData) =>
            oldData?.filter((favorite) => favorite.entityId !== entityId),
      )

      match(entityType)
         .with("issue", () => {
            queryClient.setQueryData(
               issueByIdQuery({ issueId: entityId, organizationId }).queryKey,
               (oldData) =>
                  match(oldData)
                     .with(P.nullish, (data) => data)
                     .otherwise((data) => ({ ...data, isFavorited: false })),
            )
            queryClient.setQueryData(
               issueListQuery({ organizationId }).queryKey,
               (oldData) =>
                  match(oldData)
                     .with(undefined, (data) => data)
                     .otherwise((data) =>
                        produce(data, (draft) =>
                           match(draft?.find((issue) => issue.id === entityId))
                              .with(undefined, () => {})
                              .otherwise((issue) => {
                                 issue.isFavorited = false
                              }),
                        ),
                     ),
            )
         })
         .exhaustive()
   }

   const deleteFn = useServerFn(favorite.deleteFn)
   const deleteFavorite = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ data: { entityId, entityType, organizationId } }) => {
         await queryClient.cancelQueries(favoriteListQuery({ organizationId }))

         const data = queryClient.getQueryData(
            favoriteListQuery({ organizationId }).queryKey,
         )

         deleteFavoriteFromQueryData({ entityId, entityType })

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
