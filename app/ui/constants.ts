import { cn } from "@/ui/utils"

export const MOBILE_BREAKPOINT = 768

export const MIN_REFRESH_DURATION = 1500

export const popoverAnimation = cn(
   "data-[state=closed]:animate-out data-[state=open]:animate-in",
   "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
   "data-[state=open]:data-[side=top]:slide-in-from-bottom-px data-[state=closed]:data-[side=top]:slide-out-to-bottom-px data-[state=open]:data-[side=top]:slide-in-from-left-px data-[state=closed]:data-[side=top]:slide-out-to-left-px",
   "data-[state=open]:data-[side=right]:slide-in-from-left-px data-[state=closed]:data-[side=right]:slide-out-to-left-px data-[state=open]:data-[side=right]:slide-in-from-top-px data-[state=closed]:data-[side=right]:slide-out-to-top-px",
   "data-[state=open]:data-[side=bottom]:slide-in-from-top-px data-[state=closed]:data-[side=bottom]:slide-out-to-top-px data-[state=open]:data-[side=bottom]:data-[align=start]:slide-in-from-left-px data-[state=closed]:data-[side=bottom]:data-[align=start]:slide-out-to-left-px",
   "data-[state=open]:data-[side=left]:slide-in-from-right-px data-[state=closed]:data-[side=left]:slide-out-to-right-px data-[state=open]:data-[side=left]:slide-in-from-top-px data-[state=closed]:data-[side=left]:slide-out-to-top-px",
)
