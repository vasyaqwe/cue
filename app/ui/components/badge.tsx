import { cn } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

const badgeVariants = cva(
   "inline-flex h-6 items-center rounded-full border px-2.5 text-xs shadow-sm",
   {
      variants: {
         variant: {
            default: "border-transparent bg-border",
            bug: "border-red-400/25 bg-red-400/10 text-red-600/90",
            feature: "border-green-400/25 bg-green-400/10 text-green-600/90",
            improvement:
               "border-yellow-400/25 bg-yellow-400/10 text-yellow-600/90",
         },
      },
      defaultVariants: {
         variant: "default",
      },
   },
)

function Badge({
   className,
   variant,
   ...props
}: ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
   return (
      <div
         className={cn(badgeVariants({ variant }), className)}
         {...props}
      />
   )
}

export { Badge, badgeVariants }
