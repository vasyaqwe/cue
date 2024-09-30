import { queryOptions } from "@tanstack/react-query"
import * as user from "./functions"

export const userMeQuery = () =>
   queryOptions({
      queryKey: ["user_me"],
      queryFn: () => user.me(),
      staleTime: Infinity,
      retry: false,
   })
