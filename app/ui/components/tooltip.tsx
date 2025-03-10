import { cn } from "@/ui/utils"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

const TooltipProvider = TooltipPrimitive.Provider
const TooltipTrigger = TooltipPrimitive.Trigger

function TooltipContent({
   className,
   sideOffset = 4,
   ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
   return (
      <TooltipPrimitive.Content
         sideOffset={sideOffset}
         className={cn(
            "fade-in-0 zoom-in-[99%] data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[99%] data-[side=bottom]:slide-in-from-top-px",
            "data-[side=left]:slide-in-from-right-px data-[side=right]:slide-in-from-left-px data-[side=top]:slide-in-from-bottom-px z-50 animate-in",
            "overflow-hidden rounded-full border border-border bg-popover px-2 py-1 text-sm shadow-xs data-[state=closed]:animate-out",
            className,
         )}
         {...props}
      />
   )
}

function Tooltip({
   children,
   content,
   open,
   defaultOpen,
   onOpenChange,
   delayDuration,
   ...props
}: Omit<TooltipPrimitive.TooltipContentProps, "content"> & {
   children: React.ReactNode
   content: React.ReactNode | string
   open?: boolean
   defaultOpen?: boolean
   onOpenChange?: (open: boolean) => void
   delayDuration?: number
}) {
   return (
      <TooltipPrimitive.Root
         open={open}
         defaultOpen={defaultOpen}
         onOpenChange={onOpenChange}
         delayDuration={delayDuration}
      >
         <TooltipTrigger asChild>{children}</TooltipTrigger>
         <>
            <TooltipContent
               side="top"
               align="center"
               {...props}
            >
               {content}
            </TooltipContent>
         </>
      </TooltipPrimitive.Root>
   )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
