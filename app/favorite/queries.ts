import { queryOptions } from "@tanstack/react-query"
import * as favorite from "./functions"

export const favoriteListQuery = (input: {
   organizationId: string
}) =>
   queryOptions({
      queryKey: ["favorite_list", input.organizationId],
      queryFn: () => favorite.list(input),
   })
