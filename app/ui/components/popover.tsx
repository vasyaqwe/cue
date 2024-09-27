import { Drawer, DrawerContent, DrawerTrigger } from "@/ui/components/drawer"
import { useIsMobile } from "@/ui/hooks/use-is-mobile"
import { cn } from "@/ui/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import {
   type AnimationEventHandler,
   type ComponentPropsWithoutRef,
   type ComponentType,
   type ElementRef,
   forwardRef,
} from "react"

const Popover = PopoverPrimitive.Root
const PopoverPortal = PopoverPrimitive.Portal
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = forwardRef<
   ElementRef<typeof PopoverPrimitive.Content>,
   ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
   <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
         ref={ref}
         align={align}
         sideOffset={sideOffset}
         className={cn(
            "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-[10px] border border-border bg-popover text-popover-foreground shadow-lg",
            "data-[state=closed]:animate-out data-[state=open]:animate-in",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=open]:data-[side=top]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=top]:slide-out-to-bottom-[1px] data-[state=open]:data-[side=top]:slide-in-from-left-[1px] data-[state=closed]:data-[side=top]:slide-out-to-left-[1px]",
            "data-[state=open]:data-[side=right]:slide-in-from-left-[1px] data-[state=closed]:data-[side=right]:slide-out-to-left-[1px] data-[state=open]:data-[side=right]:slide-in-from-top-[1px] data-[state=closed]:data-[side=right]:slide-out-to-top-[1px]",
            "data-[state=open]:data-[side=bottom]:slide-in-from-top-[1px] data-[state=closed]:data-[side=bottom]:slide-out-to-top-[1px] data-[state=open]:data-[side=bottom]:data-[align=start]:slide-in-from-left-[1px] data-[state=closed]:data-[side=bottom]:data-[align=start]:slide-out-to-left-[1px]",
            "data-[state=open]:data-[side=left]:slide-in-from-right-[1px] data-[state=closed]:data-[side=left]:slide-out-to-right-[1px] data-[state=open]:data-[side=left]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=left]:slide-out-to-bottom-[1px]",
            className,
         )}
         {...props}
      />
   </PopoverPrimitive.Portal>
))

type WrapperProps = PopoverPrimitive.PopoverProps
type ContentProps = Omit<
   PopoverPrimitive.PopoverContentProps,
   "onAnimationEnd"
> & {
   onAnimationEnd?: AnimationEventHandler<HTMLDivElement>
}

const { Content, Wrapper, Trigger } = createResponsiveWrapper({
   desktop: {
      Wrapper: Popover,
      Content: PopoverContent,
      Trigger: PopoverTrigger,
   },
   mobile: {
      Wrapper: Drawer,
      Content: DrawerContent,
      Trigger: DrawerTrigger,
   },
})

function createResponsiveWrapper({
   mobile,
   desktop,
}: {
   mobile: {
      Wrapper: ComponentType<WrapperProps>
      Content: ComponentType<ContentProps>
      Trigger: ComponentType<PopoverPrimitive.PopoverTriggerProps>
   }
   desktop: {
      Wrapper: ComponentType<WrapperProps>
      Content: ComponentType<ContentProps>
      Trigger: ComponentType<PopoverPrimitive.PopoverTriggerProps>
   }
}) {
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

   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   function Trigger(props: any) {
      const { isMobile } = useIsMobile()
      return isMobile ? (
         <mobile.Trigger {...props} />
      ) : (
         <desktop.Trigger {...props} />
      )
   }

   return {
      Wrapper,
      Content,
      Trigger,
   }
}

export {
   Wrapper as Popover,
   Trigger as PopoverTrigger,
   Content as PopoverContent,
   PopoverAnchor,
   PopoverPortal,
}
