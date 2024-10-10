import { cn } from "@/ui/utils"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import {
   type ComponentPropsWithoutRef,
   type ElementRef,
   forwardRef,
} from "react"

const HoverCard = HoverCardPrimitive.Root

function HoverCardTrigger({
   className,
   ...props
}: HoverCardPrimitive.HoverCardTriggerProps) {
   return (
      <HoverCardPrimitive.Trigger
         className={cn("no-underline", className)}
         {...props}
      />
   )
}

const HoverCardContent = forwardRef<
   ElementRef<typeof HoverCardPrimitive.Content>,
   ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
   <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
         "z-50 w-64 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
         "data-[state=closed]:animate-out data-[state=open]:animate-in",
         "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[98%] data-[state=open]:zoom-in-[98%]",
         "data-[side=bottom]:slide-in-from-top-px data-[side=left]:slide-in-from-right-px data-[side=right]:slide-in-from-left-px data-[side=top]:slide-in-from-bottom-px",
         className,
      )}
      {...props}
   />
))

export { HoverCard, HoverCardTrigger, HoverCardContent }
