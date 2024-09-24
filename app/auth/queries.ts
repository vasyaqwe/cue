import { queryOptions } from "@tanstack/react-query"
import * as auth from "./functions"

export const meQuery = () =>
   queryOptions({
      queryKey: ["me"],
      queryFn: () => auth.me(),
      staleTime: Infinity,
   })
