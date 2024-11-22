import { queryOptions } from "@tanstack/react-query"
import * as search from "./functions"

export const searchListQuery = (input: {
   organizationId: string
   query: string
}) =>
   queryOptions({
      queryKey: ["search_list", input.query, input.organizationId],
      queryFn: () => search.list({ data: input }),
   })
