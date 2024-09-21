import { MOBILE_BREAKPOINT } from "@/ui/constants"
import type { DialogContentProps, DialogProps } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"

type WrapperProps = DialogProps
type ContentProps = Omit<DialogContentProps, "onAnimationEnd"> & {
   onAnimationEnd?: (...args: unknown[]) => void
}
type Options = {
   mobile: {
      Wrapper: React.ComponentType<WrapperProps>
      Content: React.ComponentType<ContentProps>
   }
   desktop: {
      Wrapper: React.ComponentType<WrapperProps>
      Content: React.ComponentType<ContentProps>
   }
}

export function createResponsiveWrapper({ mobile, desktop }: Options) {
   function useIsMobile() {
      const [isMobile, setIsMobile] = useState(false)

      useEffect(() => {
         const checkDevice = (event: MediaQueryList | MediaQueryListEvent) => {
            setIsMobile(event.matches)
         }

         // Initial detection
         const mediaQueryList = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT}px)`,
         )
         checkDevice(mediaQueryList)

         // Listener for media query change
         mediaQueryList.addEventListener("change", checkDevice)

         // Cleanup listener
         return () => {
            mediaQueryList.removeEventListener("change", checkDevice)
         }
      }, [])

      return isMobile
   }

   function Wrapper(props: WrapperProps) {
      const isMobile = useIsMobile()
      return isMobile ? (
         <mobile.Wrapper {...props} />
      ) : (
         <desktop.Wrapper {...props} />
      )
   }
   function Content(props: ContentProps) {
      const isMobile = useIsMobile()
      return isMobile ? (
         <mobile.Content {...props} />
      ) : (
         <desktop.Content {...props} />
      )
   }

   return {
      Wrapper,
      Content,
   }
}
