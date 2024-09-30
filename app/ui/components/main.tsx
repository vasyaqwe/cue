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
            "h-full max-h-[calc(100svh-var(--header-height)-var(--bottom-menu-height))] w-full flex-1 overflow-y-auto pb-8 md:max-h-[calc(100svh-var(--header-height))] md:pb-16",
            className,
         )}
         {...props}
      >
         {children}
      </main>
   )
}
