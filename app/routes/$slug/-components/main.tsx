import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"

export function Main({
   className,
   children,
   ...props
}: ComponentProps<"main">) {
   return (
      <main
         className={cn(
            "relative h-full max-h-[calc(100svh-var(--header-height)-var(--bottom-menu-height))] w-full flex-1 overflow-y-auto pb-16 md:max-h-[calc(100svh-var(--header-height))]",
            className,
         )}
         {...props}
      >
         {children}
      </main>
   )
}
