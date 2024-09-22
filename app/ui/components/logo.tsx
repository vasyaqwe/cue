import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"

export function Logo({ className, ...props }: ComponentProps<"div">) {
   return (
      <div
         className={cn(
            "size-12 drop-shadow-[0px_3px_3px_rgba(24,24,24,.1)]",
            className,
         )}
         {...props}
      >
         <div className="squircle grid size-full place-content-center bg-background bg-gradient-to-b from-brand/70 to-brand text-background">
            <Icons.logo className="mx-auto w-full max-w-[60%]" />
         </div>
      </div>
   )
}
