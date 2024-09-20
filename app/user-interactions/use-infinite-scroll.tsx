import { useIntersectionObserver } from "@/user-interactions/use-intersection"
import type { FetchNextPageOptions } from "@tanstack/react-query"
import { useEffect } from "react"

export function useInfiniteScroll({
   limit,
   fetchNextPage,
   hasNextPage,
   dataLength,
}: {
   limit: number
   fetchNextPage: (opts?: FetchNextPageOptions) => Promise<unknown>
   hasNextPage: boolean
   dataLength: number
}) {
   const { ref, entry } = useIntersectionObserver({
      threshold: 0,
   })

   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   useEffect(() => {
      if (dataLength < limit) return

      if (hasNextPage && entry?.isIntersecting) {
         fetchNextPage()
      }
   }, [entry, hasNextPage, dataLength])

   return {
      ref,
   }
}
