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
            "relative h-full w-full overflow-y-auto pb-16",
            className,
         )}
         {...props}
      >
         {children}
      </Comp>
   )
}
