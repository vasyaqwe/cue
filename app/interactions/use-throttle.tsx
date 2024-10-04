import { useEffect, useRef, useState } from "react"

export function useThrottle<T>(value: T, interval = 500) {
   const [throttledValue, setThrottledValue] = useState<T>(value)
   const lastUpdated = useRef<number>(Date.now())

   useEffect(() => {
      if (value === true && throttledValue !== true) {
         lastUpdated.current = Date.now()
         setThrottledValue(value)
         return
      }

      const now = Date.now()

      if (now >= lastUpdated.current + interval) {
         lastUpdated.current = now
         setThrottledValue(value)
      } else {
         const timeoutId = window.setTimeout(() => {
            lastUpdated.current = Date.now()
            setThrottledValue(value)
         }, interval)
         return () => window.clearTimeout(timeoutId)
      }
   }, [value, interval, throttledValue])

   return throttledValue
}
