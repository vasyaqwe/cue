import { MOBILE_BREAKPOINT } from "@/ui/constants"
import { useEffect, useState } from "react"

export function useIsMobile() {
   const [isMobile, setIsMobile] = useState(false)

   useEffect(() => {
      const checkDevice = (event: MediaQueryList | MediaQueryListEvent) => {
         setIsMobile(event.matches)
      }

      const mediaQueryList = window.matchMedia(
         `(max-width: ${MOBILE_BREAKPOINT}px)`,
      )
      checkDevice(mediaQueryList)

      mediaQueryList.addEventListener("change", checkDevice)

      return () => {
         mediaQueryList.removeEventListener("change", checkDevice)
      }
   }, [])

   return { isMobile }
}
