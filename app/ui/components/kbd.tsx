import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"

export function Kbd({ className, children, ...props }: ComponentProps<"kbd">) {
   return (
      <kbd
         className={cn(
            `ml-auto inline-flex items-center gap-[3px] rounded-md border border-border bg-background/90 px-1 font-semibold text-muted-foreground tracking-widest shadow-inner group-hover:border-muted group-hover:bg-background/75`,
            className,
         )}
         {...props}
      >
         {children}
      </kbd>
   )
}
