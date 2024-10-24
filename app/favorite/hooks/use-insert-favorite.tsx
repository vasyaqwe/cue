import * as favorite from "@/favorite/functions"
import { favoriteListQuery } from "@/favorite/queries"
import { issueByIdQuery, issueListQuery } from "@/issue/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { produce } from "immer"
import { toast } from "sonner"
import { P, match } from "ts-pattern"

export function useInsertFavorite() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()

   const insertFn = useServerFn(favorite.insert)

   const insertFavoriteToQueryData = ({
      input,
   }: { input: Awaited<ReturnType<typeof favorite.list>>[number] }) => {
      queryClient.setQueryData(
         favoriteListQuery({ organizationId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) => [input, ...data]),
      )

      match(input.entityType).with("issue", () => {
         queryClient.setQueryData(
            issueByIdQuery({ issueId: input.entityId, organizationId })
               .queryKey,
            (oldData) =>
               match(oldData)
                  .with(P.nullish, (data) => data)
                  .otherwise((data) => ({ ...data, isFavorited: true })),
         )
         queryClient.setQueryData(
            issueListQuery({ organizationId }).queryKey,
            (oldData) =>
               match(oldData)
                  .with(undefined, (data) => data)
                  .otherwise((data) =>
                     produce(data, (draft) =>
                        match(
                           draft?.find((issue) => issue.id === input.entityId),
                        )
                           .with(undefined, () => {})
                           .otherwise((issue) => {
                              issue.isFavorited = true
                           }),
                     ),
                  ),
         )
      })
   }

   const insertFavorite = useMutation({
      mutationFn: insertFn,
      onMutate: async (input) => {
         await queryClient.cancelQueries(favoriteListQuery({ organizationId }))
         const data = queryClient.getQueryData(
            favoriteListQuery({ organizationId }).queryKey,
         )
         insertFavoriteToQueryData({
            input: {
               id: crypto.randomUUID(),
               entityId: input.entityId,
               entityType: input.entityType,
               issue: input.issue,
            },
         })
         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            favoriteListQuery({ organizationId }).queryKey,
            context?.data,
         )
         toast.error("Failed to favorite")
      },
      onSettled: () => {
         queryClient.invalidateQueries(favoriteListQuery({ organizationId }))
      },
   })

   return {
      insertFavorite,
      insertFavoriteToQueryData,
   }
}
