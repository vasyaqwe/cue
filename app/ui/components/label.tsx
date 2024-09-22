import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"

export function Label({ className, ...props }: ComponentProps<"label">) {
   return (
      <label
         className={cn(
            "mb-1 inline-block text-foreground/70 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            className,
         )}
         {...props}
      />
   )
}
