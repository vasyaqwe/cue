import { useThrottle } from "@/interactions/use-throttle"
import { MIN_REFRESH_DURATION } from "@/ui/constants"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { match } from "ts-pattern"

export function useRefreshState({
   refetch,
   isRefetching,
   onChange,
}: {
   refetch: () => Promise<unknown>
   isRefetching: boolean
   onChange: (isRefetching: boolean) => void
}) {
   const isRefreshing = useRef(false)

   useEffect(() => {
      match({ isRefetching, isRefreshing: isRefreshing.current }).with(
         {
            isRefetching: false,
            isRefreshing: true,
         },
         () => {
            isRefreshing.current = false
         },
      )
   }, [isRefetching])

   const refresh = useCallback(() => {
      isRefreshing.current = true
      return refetch()
   }, [refetch])

   const isActiveRefresh = useMemo(
      () => isRefetching && isRefreshing.current,
      [isRefetching],
   )

   const isRefreshingValue = useThrottle(isActiveRefresh, MIN_REFRESH_DURATION)

   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   useEffect(() => {
      onChange(isRefreshingValue)
   }, [isRefreshingValue])

   return {
      refresh,
      isRefreshing: isRefreshingValue,
   }
}
