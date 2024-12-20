import { useThrottle } from "@/interactions/use-throttle"
import { MIN_REFRESH_DURATION } from "@/ui/constants"
import * as React from "react"

export function useRefreshState({
   refetch,
   isRefetching,
   onChange,
}: {
   refetch: () => Promise<unknown>
   isRefetching: boolean
   onChange: (isRefetching: boolean) => void
}) {
   const isRefreshing = React.useRef(false)

   React.useEffect(() => {
      if (!isRefetching && isRefreshing.current) isRefreshing.current = false
   }, [isRefetching])

   const refresh = React.useCallback(() => {
      isRefreshing.current = true
      return refetch()
   }, [refetch])

   const isActiveRefresh = React.useMemo(
      () => isRefetching && isRefreshing.current,
      [isRefetching],
   )

   const isRefreshingValue = useThrottle(isActiveRefresh, MIN_REFRESH_DURATION)

   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   React.useEffect(() => {
      onChange(isRefreshingValue)
   }, [isRefreshingValue])

   return {
      refresh,
      isRefreshing: isRefreshingValue,
   }
}
