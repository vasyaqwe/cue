import { queryOptions } from "@tanstack/react-query"
import * as auth from "./functions"

export const userMeQuery = () =>
   queryOptions({
      queryKey: ["user_me"],
      queryFn: () => auth.me(),
      staleTime: Infinity,
      retry: false,
   })
