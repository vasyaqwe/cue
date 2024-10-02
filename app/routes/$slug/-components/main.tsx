import { cn } from "@/ui/utils"
import { Slot } from "@radix-ui/react-slot"
import type { ComponentProps } from "react"

export function Main({
   className,
   children,
   asChild = false,
   ...props
}: ComponentProps<"main"> & { asChild?: boolean }) {
   const Comp = asChild ? Slot : "main"
   return (
      <Comp
         className={cn(
            "relative h-full max-h-[calc(100svh-var(--header-height)-var(--bottom-menu-height))] w-full flex-1 overflow-y-auto pb-16 md:max-h-[calc(100svh-var(--header-height))]",
            className,
         )}
         {...props}
      >
         {children}
      </Comp>
   )
}
