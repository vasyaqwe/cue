import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"

export function Main({
   className,
   children,
   asMain = true,
   ...props
}: ComponentProps<"div"> & { asMain?: boolean }) {
   const Comp = asMain ? "main" : "div"

   return (
      <Comp
         className={cn(
            "relative h-[calc(100%-var(--header-height)-1px)] w-full overflow-y-auto pb-safe md:pb-16",
            className,
         )}
         {...props}
      >
         {children}
      </Comp>
   )
}
