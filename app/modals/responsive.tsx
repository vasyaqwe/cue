import { useIsMobile } from "@/ui/hooks/use-is-mobile"
import type { DialogContentProps, DialogProps } from "@radix-ui/react-dialog"

type WrapperProps = DialogProps
type ContentProps = Omit<DialogContentProps, "onAnimationEnd"> & {
   onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
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
   function Wrapper(props: WrapperProps) {
      const { isMobile } = useIsMobile()
      return isMobile ? (
         <mobile.Wrapper {...props} />
      ) : (
         <desktop.Wrapper {...props} />
      )
   }
   function Content(props: ContentProps) {
      const { isMobile } = useIsMobile()
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
