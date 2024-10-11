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
            "relative h-[calc(100%-var(--bottom-menu-height)+4px-max(env(safe-area-inset-bottom),0px))] w-full overflow-y-auto md:h-[calc(100%-var(--header-height)-1px)]",
            className,
         )}
         {...props}
      >
         {children}
      </Comp>
   )
}
